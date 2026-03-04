$p = 'c:\Users\Karan\Desktop\Shoes-ecommerce-main\shoe\src\components\AnalyticsDashboard.js'
$c = Get-Content $p

$startLine = -1
for ($i = 0; $i -lt $c.Length; $i++) {
    if ($c[$i] -like '*// 2. Calculations for Charts & Summary*') {
        $startLine = $i
        break
    }
}

$endLine = -1
for ($i = $startLine; $i -lt $c.Length; $i++) {
    if ($c[$i] -like '*})()*') {
        $endLine = $i
        break
    }
}

if ($startLine -ne -1 -and $endLine -ne -1) {
    $newContent = @"
                            // 2. Calculations for Charts & Summary
                            const totalFilteredStock = filtered.reduce((acc, loc) => acc + loc.totalStock, 0);
                            
                            // Get location analytics from backend data
                            const backendLocData = data.locationAnalytics || [];
                            const filteredLocPerformance = backendLocData.filter(loc => {
                                const matchesSearch = franchiseSearch === '' ? true :
                                    (searchBy === 'location' && loc.city?.toLowerCase().includes(franchiseSearch.toLowerCase())) ||
                                    (searchBy === 'pincode' && loc.pincode?.toString().includes(franchiseSearch)) ||
                                    (searchBy === 'both' && (
                                        loc.city?.toLowerCase().includes(franchiseSearch.toLowerCase()) ||
                                        loc.pincode?.toString().includes(franchiseSearch)
                                    ));
                                return matchesSearch;
                            });

                            let barLabels, barValues, barLabelText;
                            if (filtered.length === 1) {
                                const loc = filtered[0];
                                barLabels = loc.products.slice(0, 15).map(p => p.name);
                                barValues = loc.products.slice(0, 15).map(p => p.stock);
                                barLabelText = ``Stock in `$($loc.name)``;
                            } else {
                                barLabels = filtered.length > 15 ? filtered.slice(0, 15).map(l => l.name) : filtered.map(l => l.name);
                                barValues = filtered.length > 15 ? filtered.slice(0, 15).map(l => l.totalStock) : filtered.map(l => l.totalStock);
                                barLabelText = "Location Comparison";
                            }

                            const healthStats = filtered.reduce((acc, l) => {
                                acc.healthy += l.healthy;
                                acc.critical += l.critical;
                                acc.empty += l.empty;
                                return acc;
                            }, { healthy: 0, critical: 0, empty: 0 });

                            const chartColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

                            // 3. Final Render
                            return (
                                <div className="space-y-10">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Locations Found</h3>
                                            <p className="text-4xl font-black text-gray-900">{filtered.length}</p>
                                            <div className="mt-4 flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                                Active Search
                                            </div>
                                        </div>
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Filtered Stock</h3>
                                            <p className="text-4xl font-black text-gray-900">{totalFilteredStock.toLocaleString()}</p>
                                            <div className="mt-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Units in selection</div>
                                        </div>
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Consistency</h3>
                                            <p className="text-4xl font-black text-blue-600">Stable</p>
                                            <div className="mt-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Inventory Health</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Stock Level Bar Chart */}
                                        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900">{barLabelText}</h3>
                                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Inventory counts</p>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {filtered.length === 1 ? 'Showing Products' : ``Showing `$($filtered.length) Areas``}
                                                </div>
                                            </div>
                                            <div className="h-[350px]">
                                                <Bar
                                                    data={{
                                                        labels: barLabels,
                                                        datasets: [{
                                                            label: 'Units',
                                                            data: barValues,
                                                            backgroundColor: chartColors,
                                                            borderRadius: 12,
                                                            barThickness: filtered.length === 1 ? 24 : 32,
                                                        }]
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: { legend: { display: false } },
                                                        scales: {
                                                            y: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
                                                            x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stock Health Doughnut */}
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <h3 className="text-xl font-black text-gray-900 mb-2">Inventory Health</h3>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-8">Stock status distribution</p>
                                            <div className="h-[250px] relative">
                                                <Doughnut
                                                    data={{
                                                        labels: ['Healthy (>10)', 'Critical (<10)', 'Out of Stock'],
                                                        datasets: [{
                                                            data: [healthStats.healthy, healthStats.critical, healthStats.empty],
                                                            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                                                            borderWidth: 0,
                                                            cutout: '75%'
                                                        }]
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: { legend: { display: false } }
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                    <span className="text-4xl font-black text-gray-900">{healthStats.healthy + healthStats.critical + healthStats.empty}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total SKU-P</span>
                                                </div>
                                            </div>
                                            <div className="mt-8 space-y-3">
                                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-2xl">
                                                    <span className="text-xs font-black text-green-700">Healthy</span>
                                                    <span className="text-sm font-black text-green-700">{healthStats.healthy}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-2xl">
                                                    <span className="text-xs font-black text-orange-700">Critical</span>
                                                    <span className="text-sm font-black text-orange-700">{healthStats.critical}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-2xl">
                                                    <span className="text-xs font-black text-red-700">Out of Stock</span>
                                                    <span className="text-sm font-black text-red-700">{healthStats.empty}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* New Location Performance Chart */}
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900">Location Performance</h3>
                                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Sales, Orders, and Status</p>
                                            </div>
                                            <div className="bg-red-50 px-4 py-2 rounded-xl text-[10px] font-black text-red-600 uppercase tracking-widest">
                                                Orders Analysis
                                            </div>
                                        </div>
                                        <div className="h-[400px]">
                                            <Bar
                                                data={{
                                                    labels: filteredLocPerformance.map(l => l.city || l.pincode),
                                                    datasets: [
                                                        {
                                                            label: 'Deliveries',
                                                            data: filteredLocPerformance.map(l => l.delivered),
                                                            backgroundColor: '#10b981',
                                                            borderRadius: 8
                                                        },
                                                        {
                                                            label: 'Returns',
                                                            data: filteredLocPerformance.map(l => l.returns),
                                                            backgroundColor: '#f59e0b',
                                                            borderRadius: 8
                                                        },
                                                        {
                                                            label: 'Cancelled',
                                                            data: filteredLocPerformance.map(l => l.cancelled),
                                                            backgroundColor: '#ef4444',
                                                            borderRadius: 8
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: { 
                                                        legend: { 
                                                            display: true,
                                                            position: 'top',
                                                            labels: { font: { weight: 'bold' } }
                                                        } 
                                                    },
                                                    scales: {
                                                        y: { grid: { borderDash: [5, 5] }, ticks: { font: { weight: 'bold' } } },
                                                        x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
"@

    $before = $c[0..($startLine - 1)]
    $after = $c[($endLine + 1)..($c.Length - 1)]
    
    $final = $before + $newContent + $after
    $final | Set-Content $p
    Write-Host "Replaced lines from $($startLine + 1) to $($endLine + 1)"
} else {
    Write-Error "Could not find start or end markers. Start: $startLine, End: $endLine"
}
