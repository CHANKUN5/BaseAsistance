import React from 'react';

const Table = ({ children, className = '' }) => {
    return (
        <div className={`w-full overflow-auto ${className}`}>
            <table className="w-full caption-bottom text-sm text-left">
                {children}
            </table>
        </div>
    );
};

const TableHeader = ({ children, className = '' }) => {
    return (
        <thead className={`[&_tr]:border-b border-slate-200 ${className}`}>
            {children}
        </thead>
    );
};

const TableBody = ({ children, className = '' }) => {
    return (
        <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
            {children}
        </tbody>
    );
};

const TableRow = ({ children, className = '', ...props }) => {
    return (
        <tr
            className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50 ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
};

const TableHead = ({ children, className = '', ...props }) => {
    return (
        <th
            className={`h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 ${className}`}
            {...props}
        >
            {children}
        </th>
    );
};

const TableCell = ({ children, className = '', ...props }) => {
    return (
        <td
            className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
            {...props}
        >
            {children}
        </td>
    );
};

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
};
