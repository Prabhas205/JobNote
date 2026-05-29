// src/components/SortSelect.jsx
function SortSelect({ value, onChange }) {
    const options = [
        { value: 'newest', label: '🕒 Newest First' },
        { value: 'oldest', label: '🕰️ Oldest First' },
        { value: 'salary', label: '💰 Highest Salary' },
        { value: 'name_asc', label: '🔤 Title A-Z' },
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2
                   bg-white outline-none focus:border-blue-500
                   cursor-pointer transition-colors"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SortSelect;