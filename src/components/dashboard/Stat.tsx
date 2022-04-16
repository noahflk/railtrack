type Props = {
  title: string;
  icon: React.ReactNode;
};

const Stat: React.FC<Props> = ({ title, children, icon }) => (
  <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
    <div className="flex items-center justify-between w-full p-6 space-x-6">
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        </div>
        {children}
      </div>
      {icon}
    </div>
  </li>
);

export default Stat;
