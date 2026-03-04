$p = 'c:\Users\Karan\Desktop\Shoes-ecommerce-main\shoe\src\components\AnalyticsDashboard.js'
$c = Get-Content $p
# Remove the last 13 lines
if ($c.Length -gt 13) {
    $n = $c[0..($c.Length - 14)]
} else {
    $n = $c
}
$n += '                                </div>'
$n += '                            );'
$n += '                        })()}'
$n += '                    </>'
$n += '                )}'
$n += '            </div>'
$n += '        </div>'
$n += '    );'
$n += '};'
$n += ''
$n += 'export default AnalyticsDashboard;'
$n | Set-Content $p
