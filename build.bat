@echo off

rem call node_modules/.bin/webfont "src/icons/font/*.svg" --font-name "jazzmap" --formats "svg,woff" --dest "public/icons/font"

node node_modules/webpack/bin/webpack.js --display-error-details %*

if errorlevel 1 (
  echo.
  echo.
  echo -------------------------------------------------
  echo ! Build FAILED with errors.                     !
  echo -------------------------------------------------
)

exit /b %errorlevel%
