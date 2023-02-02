type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const Stat: React.FC<Props> = ({ title, children, icon }) => (
  <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
    <div className="flex w-full items-center justify-between space-x-6 p-6">
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-sm font-medium text-gray-900">{title}</h3>
        </div>
        {children}
      </div>
      {icon}
    </div>
  </li>
);
