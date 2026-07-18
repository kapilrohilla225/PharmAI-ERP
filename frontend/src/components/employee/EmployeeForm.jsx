import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createEmployee, updateEmployee } from "../../services/employeeService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENT_OPTIONS, getDefaultDepartmentForRole, getDepartmentOptionsForRole } from "../../constants/departments";
import { DESIGNATION_OPTIONS, getDesignationOptionsForDepartment } from "../../constants/designations";

const EmployeeForm = ({ employee, onSuccess, onClose }) => {
  const isEdit = !!employee;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const canEditSalary = user?.role === "admin";
  const departmentOptions = getDepartmentOptionsForRole(user?.role);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const selectedDepartment = watch("department");
  const selectedDesignation = watch("designation");
  const designationOptions = getDesignationOptionsForDepartment(selectedDepartment);

  useEffect(() => {
    if (employee) {
      const employeeDepartment =
        departmentOptions.some((option) => option.value === employee.department)
          ? employee.department
          : getDefaultDepartmentForRole(user?.role);
      const employeeDesignationOptions = getDesignationOptionsForDepartment(employeeDepartment);
      reset({
        fullName: employee.fullName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employeeDepartment,
        designation:
          employeeDesignationOptions.some((option) => option.value === employee.designation)
            ? employee.designation
            : employeeDesignationOptions[0]?.value || "",
        salary: employee.salary || 0,
        address: employee.address || "",
        status: employee.status || "Active",
        joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split("T")[0] : "",
      });
    } else {
      const defaultDepartment = getDefaultDepartmentForRole(user?.role);
      const defaultDesignationOptions = getDesignationOptionsForDepartment(defaultDepartment);
      reset({
        fullName: "",
        email: "",
        phone: "",
        department: defaultDepartment,
        designation: defaultDesignationOptions[0]?.value || "",
        salary: 0,
        address: "",
        status: "Active",
        joiningDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [departmentOptions, employee, reset, user?.role]);

  useEffect(() => {
    const currentOptions = designationOptions;
    if (!currentOptions.some((option) => option.value === selectedDesignation)) {
      setValue("designation", currentOptions[0]?.value || "");
    }
  }, [designationOptions, selectedDesignation, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateEmployee(employee._id, data);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(data);
        toast.success("Employee added successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
        <Input
          placeholder="e.g. John Doe"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</label>
          <Input
            type="email"
            placeholder="john.doe@company.com"
            disabled={isEdit}
            {...register("email", { required: "Email address is required" })}
          />
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone Number</label>
          <Input
            placeholder="e.g. 9876543210"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Department</label>
          <Select
            options={departmentOptions}
            {...register("department", { required: "Department is required" })}
          />
          {errors.department && <p className="mt-1 text-xs text-rose-500">{errors.department.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Designation</label>
          <Select
            options={designationOptions}
            {...register("designation", { required: "Designation is required" })}
          />
          {errors.designation && <p className="mt-1 text-xs text-rose-500">{errors.designation.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Salary (INR)</label>
          {canEditSalary ? (
            <>
              <Input
                type="number"
                placeholder="Monthly Salary"
                {...register("salary", { required: "Salary is required", valueAsNumber: true })}
              />
              {errors.salary && <p className="mt-1 text-xs text-rose-500">{errors.salary.message}</p>}
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-slate-400">
              Salary is hidden for HR users. Compensation can only be reviewed or changed by admin accounts.
            </div>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Joining Date</label>
          <Input
            type="date"
            {...register("joiningDate", { required: "Joining date is required" })}
          />
          {errors.joiningDate && <p className="mt-1 text-xs text-rose-500">{errors.joiningDate.message}</p>}
        </div>
      </div>

      {!isEdit && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Initial Password</label>
          <Input
            type="password"
            placeholder="Set a password for this user"
            {...register("password", { required: "Initial password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
          />
          {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Address</label>
        <Input
          placeholder="Enter current residential address"
          {...register("address")}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Status</label>
        <Select
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
          {...register("status")}
        />
      </div>

      <div className="flex gap-4 pt-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Employee" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;