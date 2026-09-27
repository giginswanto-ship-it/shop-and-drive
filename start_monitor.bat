@echo off
title Sistem Monitoring Rekapitulasi Keuangan Bengkel Terpadu
echo ========================================================
echo   MEMULAI SERVER DATABASE & APLIKASI MONITOR KEUANGAN
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js terdeteksi. Menjalankan Server Database Lokal...
    start /B node server.js
    timeout /t 1 >nul
    start "" "http://localhost:3000"
) else (
    echo [INFO] Membuka langsung antarmuka monitor...
    start "" "%~dp0index.html"
)

exit
