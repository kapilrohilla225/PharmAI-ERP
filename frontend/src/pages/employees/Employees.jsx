import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SearchBox from "../../components/ui/SearchBox";
import Table from "../../components/ui/Table";
import EmployeeDrawer from "../../components/employee/EmployeeDrawer";
import EmployeeForm from "../../components/employee/EmployeeForm";
import useEmployees from "../../hooks/useEmployees";
import { deleteEmployee } from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import { getPermissions } from "../../constants/access";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";

const Employees = () => {
  const { user } = useAuth();
  const role = user?.role;
  const perms = getPermissions(role, "employees");

  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { employees, loading, fetchEmployees } = useEmployees();

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setOpen(true);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleDeleteClick = async (employee) => {
    if (employee.email === user?.email) {
      toast.error("You cannot delete your own account");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${employee.fullName}? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete",
      background: "#0f172a",
      color: "#ffffff",
    });

    if (result.isConfirmed) {
      try {
        await deleteEmployee(employee._id);
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete employee");
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase();
    return (
      emp.fullName?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q)
    );
  });

  // Build table columns based on permissions
  const columns = [
    "Employee ID",
    "Name & Email",
    "Department / Role",
    "Joining Date",
    "Status",
    perms.canViewSalary ? "Salary" : "Compensation",
    ...(perms.canEdit || perms.canDelete ? ["Actions"] : []),
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Employees" subtitle="Manage all staff records, departments, and HR files">
          {perms.canAdd && (
            <Button className="w-auto px-6 py-2.5 text-sm" onClick={handleAddClick}>
              + Add Employee
            </Button>
          )}
        </PageHeader>

        {role === "hr" && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            HR view — you can add and edit employee records. Salary details and Delete are restricted to Admin.
          </div>
        )}

        {role === "sales" && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            Sales view — employee directory is read-only for your role.
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
          <SearchBox
            placeholder="Search name, ID, department, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm text-slate-400">
            Total: <span className="font-semibold text-white">{filteredEmployees.length}</span> employees
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30">
          <Table columns={columns}>
            {loading ? (
              <tr><td colSpan={columns.length} className="py-12 text-center"><Loader size="md" /></td></tr>
            ) : filteredEmployees.length === 0 ? (
              <tr><td colSpan={columns.length} className="py-12 text-center text-slate-500">No employees found</td></tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="border-t border-slate-800/60 hover:bg-slate-800/25 transition duration-150">
                  <td className="px-6 py-4 font-semibold text-blue-400 text-sm">{emp.employeeId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{emp.fullName}</div>
                    <div className="text-xs text-slate-400">{emp.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{emp.department}</div>
                    <div className="text-xs text-slate-400 font-medium">{emp.designation}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString("en-IN") : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={emp.status === "Active" ? "success" : "secondary"}>{emp.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold text-sm">
                    {perms.canViewSalary
                      ? `₹${emp.salary?.toLocaleString("en-IN")}`
                      : <Badge variant="secondary">Admin only</Badge>
                    }
                  </td>
                  {/* Actions column — only rendered if role has any action */}
                  {(perms.canEdit || perms.canDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {perms.canEdit && (
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-white transition font-medium"
                          >
                            Edit
                          </button>
                        )}
                        {perms.canDelete && (
                          <button
                            onClick={() => handleDeleteClick(emp)}
                            className="rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </Table>
        </div>
      </div>

      {/* Form drawer — only shown if role has add/edit access */}
      {(perms.canAdd || perms.canEdit) && (
        <EmployeeDrawer
          open={open}
          onClose={() => setOpen(false)}
          title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
        >
          <EmployeeForm
            employee={selectedEmployee}
            onSuccess={fetchEmployees}
            onClose={() => setOpen(false)}
          />
        </EmployeeDrawer>
      )}
    </>
  );
};

export default Employees;