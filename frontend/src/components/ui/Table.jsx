const Table = ({ columns, children }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur">

      <table className="w-full">

        <thead className="bg-slate-900/95">

          <tr>

            {columns.map((col) => (
              <th
                key={col}
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"
              >
                {col}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>{children}</tbody>

      </table>

    </div>
  );
};

export default Table;