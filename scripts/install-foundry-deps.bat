@echo off
setlocal

forge install foundry-rs/forge-std --no-commit
if errorlevel 1 exit /b 1

forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-commit
if errorlevel 1 exit /b 1

forge install chiru-labs/ERC721A@v4.3.0 --no-commit
if errorlevel 1 exit /b 1

forge build
if errorlevel 1 exit /b 1

forge test
exit /b %ERRORLEVEL%
