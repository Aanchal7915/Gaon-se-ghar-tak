$p = 'c:\Users\Karan\Desktop\Shoes-ecommerce-main\shoe\src\components\AnalyticsDashboard.js'
$c = Get-Content $p -Raw
$c = $c.Replace('})()', '})()}')
$c | Set-Content $p
Write-Host "Replaced })() with })()}"
