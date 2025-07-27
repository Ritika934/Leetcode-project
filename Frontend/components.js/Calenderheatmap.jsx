// import { useEffect, useState } from 'react';
// import axiosclient from "../axiosclient"

// const CalendarHeatmap = ({ userId }) => {
//     const [activityData, setActivityData] = useState({});
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchActivityData = async () => {
//             try {
//                 const {data} = await axiosclient.get(`/user/activity/${userId}`);
//                 console.log(data,"data")
//                 setActivityData(data.activity || {});
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching activity data:", error);
//                 setLoading(false);
//             }
//         };

//         fetchActivityData();
//     }, [userId]);



//     const generateHeatmap = () => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const startDate = new Date(today);
//         startDate.setMonth(today.getMonth() - 11); 
        
//         const months = {};
//         let currentDate = new Date(startDate);
        
       
//         while (currentDate <= today) {
//             const month = currentDate.getMonth();
//             const year = currentDate.getFullYear();
//             const monthYear = `${year}-${month}`;
            
//             if (!months[monthYear]) {
//                 months[monthYear] = {
//                     name: currentDate.toLocaleString('default', { month: 'short' }),
//                     days: []
//                 };
//             }
            
//             const dateStr = currentDate.toISOString().split('T')[0];
//             months[monthYear].days.push({
//                 date: new Date(currentDate),
//                 dateStr,
//                 hasActivity: activityData[dateStr] || false
//             });
            
 
//             currentDate = new Date(currentDate);
//             currentDate.setDate(currentDate.getDate() + 1);
//         }
        
//         return (
//             <div className="overflow-x-auto py-2">
//                 <div className="flex gap-1">
//                     {Object.entries(months).map(([monthYear, monthData]) => (
//                         <div key={monthYear} className="flex flex-col items-center">
//                             <div className="text-xs font-medium mb-1 h-4">
//                                 {monthData.name}
//                             </div>
//                             <div className="grid grid-rows-7 gap-1">
//                                 {monthData.days.map((day, id) => (
//                                     <div 
//                                         key={id}
//                   className={`w-3 h-3 rounded-sm ${day.hasActivity ? 'bg-green-500' : 'bg-gray-200'}`}
//  data-tip={`${day.date.toLocaleDateString()}: ${day.hasActivity ? 'Submitted solution(s)' : 'No submissions'}`}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     if (loading) return <div className="skeleton w-full h-32"></div>;

//     return (
//         <div className="bg-base-100 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Submission Activity</h3>
//             {generateHeatmap()}
//             <div className="flex justify-end mt-3 gap-4 text-xs">
//                 <div className="flex items-center">
//                     <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
//                     <span>Submitted</span>
//                 </div>
//                 <div className="flex items-center">
//                     <div className="w-3 h-3 bg-gray-200 mr-1 rounded-sm"></div>
//                     <span>No activity</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CalendarHeatmap;
import { useEffect, useState } from 'react';
import axiosclient from "../axiosclient"; // Ensure this path is correct

const CalendarHeatmap = ({ userId }) => {
    const [activityData, setActivityData] = useState({});
    const [loading, setLoading] = useState(true);
    const [monthsToDisplay, setMonthsToDisplay] = useState([]);

    useEffect(() => {
        // Step 1: Fetch activity data from your API
        const fetchActivityData = async () => {
            setLoading(true);
            try {
                // API should return an object like: { "2024-07-21": 2, "2024-07-22": 5 }
                const { data } = await axiosclient.get(`/user/activity/${userId}`);
                setActivityData(data.activity || {});
            } catch (error) {
                console.error("Error fetching activity data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchActivityData();
        }
    }, [userId]);

    useEffect(() => {
        // Step 2: Process the fetched data into a structured array of months
        if (loading) return;

        const today = new Date();
        const generatedMonths = [];

        // Generate the last 12 months, starting from the current month
        for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const year = date.getFullYear();
            const monthIndex = date.getMonth();
            const monthName = date.toLocaleString('default', { month: 'long' });

            const firstDayOfMonth = new Date(year, monthIndex, 1).getDay(); // 0=Sunday, 1=Monday...
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

            const daysInGrid = [];

            // Add placeholder divs for days before the 1st of the month
            for (let j = 0; j < firstDayOfMonth; j++) {
                daysInGrid.push({ isPlaceholder: true, key: `placeholder-${i}-${j}` });
            }

            // Add the actual days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, monthIndex, day);
                const dateStr = currentDate.toISOString().split('T')[0];
                const activityCount = activityData[dateStr] || 0;
                const isToday = today.toDateString() === currentDate.toDateString();

                daysInGrid.push({
                    date: day,
                    activityCount,
                    isToday,
                    isPlaceholder: false,
                    key: dateStr,
                    fullDate: currentDate
                });
            }
            generatedMonths.push({ year, monthName, days: daysInGrid });
        }
        setMonthsToDisplay(generatedMonths);

    }, [activityData, loading]);

    // Function to get the background color based on activity
    const getColorClass = (count) => {
        if (count > 8) return 'bg-success text-success-content';
        if (count > 5) return 'bg-success/80';
        if (count > 2) return 'bg-success/60';
        if (count > 0) return 'bg-success/40';
        return 'bg-base-300 hover:bg-base-content/20';
    };
    
    // Show a loading skeleton while fetching data
    if (loading) {
        return <div className="skeleton w-full h-64"></div>;
    }

    return (
        <div className="bg-base-100 p-4 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl font-bold mb-2 sm:mb-0">Contribution Activity</h3>
                {/* Legend */}
                <div className="flex items-center gap-2 text-xs">
                    <span>Less</span>
                    <div className="w-4 h-4 rounded-sm bg-base-300 border border-base-content/20"></div>
                    <div className="w-4 h-4 rounded-sm bg-success/40"></div>
                    <div className="w-4 h-4 rounded-sm bg-success/60"></div>
                    <div className="w-4 h-4 rounded-sm bg-success/80"></div>
                    <div className="w-4 h-4 rounded-sm bg-success text-success-content"></div>
                    <span>More</span>
                </div>
            </div>

            {/* Grid for displaying monthly calendars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {monthsToDisplay.map(month => (
                    <div key={`${month.monthName}-${month.year}`} className="bg-base-200 p-3 rounded-lg">
                        <h4 className="font-semibold text-center mb-2">{month.monthName} {month.year}</h4>
                        {/* Day of the week headers */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-base-content/70">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        {/* Days grid */}
                        <div className="grid grid-cols-7 gap-1 mt-1">
                            {month.days.map(day => {
                                if (day.isPlaceholder) {
                                    return <div key={day.key}></div>; // Empty div for placeholder
                                }
                                const tooltipText = day.activityCount > 0
                                    ? `${day.activityCount} contribution${day.activityCount > 1 ? 's' : ''} on ${day.fullDate.toLocaleDateString()}`
                                    : `No contributions on ${day.fullDate.toLocaleDateString()}`;

                                return (
                                    <div key={day.key} className="tooltip w-full" data-tip={tooltipText}>
                                        <div className={`flex items-center justify-center w-full aspect-square rounded ${getColorClass(day.activityCount)} ${day.isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200' : ''}`}>
                                            <span className="text-xs">{day.date}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarHeatmap;