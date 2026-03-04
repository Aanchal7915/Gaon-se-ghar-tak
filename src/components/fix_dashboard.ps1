$p = 'c:\Users\Karan\Desktop\Shoes-ecommerce-main\shoe\src\components\AnalyticsDashboard.js'
$c = Get-Content $p
# Find the line that has 'healthStats.empty' and is part of the Out of Stock div
# Line 1082 in the previous view: <span className="text-sm font-black text-red-700">{healthStats.empty}</span>
$index = -1
for ($i = 0; $i -lt $c.Length; $i++) {
    if ($c[$i] -like '*healthStats.empty*') {
        $index = $i
    }
}

if ($index -gt 0) {
    # We found the line. Now keep up to $index + 3 (closing divs for red-50, space-y-3, doughnut-card)
    $n = $c[0..($index + 3)]
    
    # Now append the clean closing structure
    $n += '                                        </div>' # closes chart grid column
    $n += '                                    </div>' # closes space-y-10
    $n += '                                </div>' # closes the IIFE return div (wait, space-y-10 IS that div)
    # Actually, let's re-verify the structure.
    # space-y-10 (line 964)
    #   Summary Cards (line 966-989)
    #   Charts Grid (line 991-1090)
    #     Bar Chart Div (line 993-1053)
    #     Doughnut Div (line 1055-1090)
    
    # So after healthStats.empty...
    # </span> (index)
    # </div> (index+1) - closes red-50
    # </div> (index+2) - closes space-y-3
    # </div> (index+3) - closes Doughnut div
    # </div> (index+4) - closes Charts Grid
    # </div> (index+5) - closes space-y-10
    
    $n = $c[0..($index + 3)]
    $n += '                                        </div>' # closes Chart Grid
    $n += '                                    </div>' # closes space-y-10
    $n += '                                );' # closes return (
    $n += '                            })()}' # closes IIFE
    $n += '                        </>' # closes Fragment
    $n += '                    )}' # closes ternary
    $n += '                </div>' # closes Franchise Section div (mt-16)
    $n += '            </div>' # closes main dashboard div (p-4)
    $n += '        );' # closes return (
    $n += '    };' # closes const AnalyticsDashboard
    $n += ''
    $n += 'export default AnalyticsDashboard;'
    
    $n | Set-Content $p
    Write-Host "File fixed successfully at index $index"
} else {
    Write-Error "Could not find target line"
}
