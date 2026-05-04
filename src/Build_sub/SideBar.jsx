import { FiType, FiAlignLeft, FiImage, FiFileText, FiEdit3, FiCheckSquare, FiCircle, FiGrid, FiMail } from 'react-icons/fi';

const fieldTypes = [
  { type: 'Heading', label: 'Heading', icon: FiType, color: 'text-blue-600 bg-blue-50' },
  { type: 'Paragraph', label: 'Paragraph', icon: FiAlignLeft, color: 'text-indigo-600 bg-indigo-50' },
  { type: 'Image', label: 'Image', icon: FiImage, color: 'text-pink-600 bg-pink-50' },
  { type: 'Email', label: 'Email', icon: FiMail, color: 'text-cyan-600 bg-cyan-50' },
  { type: 'Short', label: 'Short Answer', icon: FiEdit3, color: 'text-emerald-600 bg-emerald-50' },
  { type: 'Long', label: 'Long Answer', icon: FiFileText, color: 'text-teal-600 bg-teal-50' },
  { type: 'MultipleAnswers', label: 'Checkbox', icon: FiCheckSquare, color: 'text-orange-600 bg-orange-50' },
  { type: 'MCQ', label: 'MCQ (Single)', icon: FiCircle, color: 'text-purple-600 bg-purple-50' },
  { type: 'ImageChoice', label: 'Image Choice', icon: FiGrid, color: 'text-rose-600 bg-rose-50' },
];

const SideBar = ({ onAddField }) => {
  return (
    <aside className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Form Elements</h2>
      </div>

      <div className="p-3 space-y-1">
        {fieldTypes.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-150 group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
              <Icon size={16} />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
