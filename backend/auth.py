from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from database import get_db
from models import User
from schemas import UserCreate, Token
from utils import hash_password, verify_password
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

SECRET_KEY = "super_secret_jwt_key_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 🔹 Registro
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    hashed_pw = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pw,
        role="teacher"  # 👈 todos los nuevos usuarios serán docentes
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "Usuario docente registrado correctamente",
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str
# 🔹 Login
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # 👇 usar el nombre correcto de la columna del modelo
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role}

# 🔹 Obtener usuario actual
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user