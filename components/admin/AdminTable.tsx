import React from "react";

export interface AdminTableProps {
  headers: (string | React.ReactNode)[];
  children?: React.ReactNode;
  emptyText?: string;
  isEmpty?: boolean;
  className?: string;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  headers,
  children,
  emptyText = "No records found",
  isEmpty = false,
}) => {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-3.5">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};
