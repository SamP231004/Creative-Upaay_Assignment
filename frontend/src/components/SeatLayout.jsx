import React from 'react';

export default function SeatLayout({ occupiedSeats, selectedSeats, onSeatClick, basePrice }) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const columns = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="w-full flex flex-col items-center select-none">
            <div className="w-[85%] mb-8 relative flex flex-col items-center">
                <div className="w-full h-8 border-t-[3px] border-slate-200 dark:border-slate-800 rounded-[100%] absolute -top-4"></div>
                <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-2 font-bold z-10 bg-white dark:bg-slate-950 px-2">Screen</p>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar flex flex-col items-center gap-[6px]">
                {rows.map((row) => (
                    <div key={row} className="flex items-center gap-[5px]">
                        <span className="text-[9px] w-3 text-right font-bold text-slate-500 mr-1">{row}</span>
                        {columns.map((col) => {
                            const seatLabel = `${row}-${col}`;
                            const isOccupied = occupiedSeats.includes(seatLabel);
                            const isSelected = selectedSeats.includes(seatLabel);

                            let seatClass = "border border-slate-200 dark:border-slate-700 text-slate-400";
                            if (isOccupied) {
                                seatClass = "bg-slate-200 dark:bg-slate-800 text-transparent border-transparent pointer-events-none";
                            } else if (isSelected) {
                                seatClass = "bg-purple-600 border-transparent text-white shadow-[0_0_8px_rgba(124,58,237,0.4)]";
                            }

                            return (
                                <button
                                    key={col}
                                    onClick={() => !isOccupied && onSeatClick(seatLabel, basePrice)}
                                    disabled={isOccupied}
                                    className={`w-[20px] h-[20px] rounded-[4px] text-[8px] flex items-center justify-center transition-colors ${seatClass}`}
                                >
                                    {col}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="flex gap-6 mt-10 text-[10px] text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] border border-slate-200 dark:border-slate-700"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-200 dark:bg-slate-800"></div>
                    <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-purple-600"></div>
                    <span>Selected</span>
                </div>
            </div>
        </div>
    );
}