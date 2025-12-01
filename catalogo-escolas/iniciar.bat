@echo off
echo Ativando ambiente virtual...
call venv\Scripts\activate

echo Instalando dependências do requirements.txt...
pip install -r requirements.txt

echo Iniciando servidor Flask...
py app.py

pause
