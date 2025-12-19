@echo off
echo ========================================
echo    KHOI DONG SERVER CHO TRANG WEB
echo ========================================
echo.

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Tim thay Python
    echo.
    echo Dang khoi dong server...
    echo Mo trinh duyet va truy cap: http://localhost:8000
    echo.
    echo Nhan Ctrl+C de dung server
    echo.
    python -m http.server 8000
    goto :end
)

REM Kiểm tra py command
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Tim thay Python (py)
    echo.
    echo Dang khoi dong server...
    echo Mo trinh duyet va truy cap: http://localhost:8000
    echo.
    echo Nhan Ctrl+C de dung server
    echo.
    py -m http.server 8000
    goto :end
)

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Tim thay Node.js
    echo.
    echo Dang kiem tra http-server...
    where http-server >nul 2>&1
    if %errorlevel% neq 0 (
        echo Chua co http-server, dang cai dat...
        npm install -g http-server
    )
    echo.
    echo Dang khoi dong server...
    echo Mo trinh duyet va truy cap: http://localhost:8080
    echo.
    echo Nhan Ctrl+C de dung server
    echo.
    http-server
    goto :end
)

echo [LOI] Khong tim thay Python hoac Node.js
echo.
echo Vui long cai dat mot trong cac phan mem sau:
echo   1. Python: https://www.python.org/downloads/
echo   2. Node.js: https://nodejs.org/
echo.
echo Hoac ban co the mo truc tiep file index.html trong trinh duyet
echo.
pause

:end

