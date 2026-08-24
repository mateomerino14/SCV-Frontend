import {useState, useRef, useEffect} from 'react';

const roleOptions = [
  {value: 3, label: 'Empleado'},
  {value: 2, label: 'Supervisor'},
  {value: 5, label: 'Aprobador'},
  {value: 4, label: 'Revisor'},
  {value: 1, label: 'Administrador'},
];

const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
const onlyNumbersRegex = /^[0-9]*$/;

function useUserFormModal(formData, setFormData, setFieldErrors) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [roleMenuPosition, setRoleMenuPosition] = useState(null);
  const roleTriggerRef = useRef(null);
  const roleMenuRef = useRef(null);

  const selectedRole = roleOptions.find((role) => role.value === formData.id_rol);

  const handleChange = (key, value, filter, maxLength) => {
    if (filter && !filter.test(value)) {
      return;
    }
    if (maxLength && value.length > maxLength) {
      return;
    }
    setFormData((prev) => ({...prev, [key]: value}));
    setFieldErrors?.((prev) => ({...prev, [key]: undefined}));
  };

  const calculateRoleMenuPosition = () => {
    if (!roleTriggerRef.current) {
      return;
    }
    const rect = roleTriggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUpward = spaceBelow < 220;
    setRoleMenuPosition({
      left: rect.left,
      width: rect.width,
      top: opensUpward ? undefined : rect.bottom + 4,
      bottom: opensUpward ? window.innerHeight - rect.top + 4 : undefined,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        roleTriggerRef.current && !roleTriggerRef.current.contains(event.target) &&
        roleMenuRef.current && !roleMenuRef.current.contains(event.target)
      ) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!roleMenuOpen) {
      return;
    }
    const handleReposition = () => calculateRoleMenuPosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [roleMenuOpen]);

  const handleToggleRoleMenu = () => {
    const nextState = !roleMenuOpen;
    if (nextState) {
      calculateRoleMenuPosition();
    }
    setRoleMenuOpen(nextState);
  };

  const handleSelectRole = (role) => {
    setFormData((prev) => ({...prev, id_rol: role.value}));
    setRoleMenuOpen(false);
  };

  return {
    roleOptions, selectedRole, roleMenuOpen, roleMenuPosition, roleTriggerRef, roleMenuRef,
    handleChange, handleToggleRoleMenu, handleSelectRole, onlyLettersRegex, onlyNumbersRegex,
  };
}

export default useUserFormModal;