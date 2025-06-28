import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver'; // 👈 Add this

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch transactions:', err);
      });
  }, []);

  // ✅ CSV Export Handler
  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const fields = ['id', 'date', 'amount', 'category', 'status'];

    try {
      const res = await axios.post(
        'http://localhost:5000/api/export',
        { fields },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // important for file download
        }
      );

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'transactions.csv');
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transaction Summary</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleExport}
      >
        ⬇️ Export CSV
      </button>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td className="border px-2 py-1">{t.id}</td>
              <td className="border px-2 py-1">{t.date}</td>
              <td className="border px-2 py-1">{t.amount}</td>
              <td className="border px-2 py-1">{t.category}</td>
              <td className="border px-2 py-1">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
