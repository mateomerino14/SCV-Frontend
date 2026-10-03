import {useState, useEffect} from 'react';
import {getReminderSchedule, updateReminderSchedule, previewReminderDigest, sendReminderDigestNow} from '../../services/admin/adminService';

const maxTimes = 4;
const emptySchedule = {activo: true, dias: [1, 2, 3, 4, 5], horas: ['08:00', '12:00', '16:00']};

function useReminderSettings() {
  const [schedule, setSchedule] = useState(emptySchedule);
  const [savedSchedule, setSavedSchedule] = useState(emptySchedule);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [result, setResult] = useState(null);
  const [newTime, setNewTime] = useState('');

  const applyLoaded = (data) => {
    const loaded = {activo: data.activo, dias: data.dias || [], horas: data.horas || []};
    setSchedule(loaded);
    setSavedSchedule(loaded);
    setLastUpdate({fecha: data.fecha_actualizacion, por: data.actualizado_por});
  };

  useEffect(() => {
    const load = async () => {
      const data = await getReminderSchedule();
      setLoading(false);
      if (data.error) {
        setLoadError(data.error);
        return;
      }
      applyLoaded(data);
    };
    load();
  }, []);

  const toggleActive = (active) => setSchedule((prev) => ({...prev, activo: active}));

  const toggleDay = (day) => {
    setSchedule((prev) => {
      let days = [...prev.dias, day];
      if (prev.dias.includes(day)) {
        days = prev.dias.filter((current) => current !== day);
      }
      return {...prev, dias: days.sort((a, b) => a - b)};
    });
  };

  const addTime = () => {
    if (!newTime) {
      setResult({success: false, message: 'Elige una hora para agregarla.'});
      return;
    }
    if (schedule.horas.includes(newTime)) {
      setResult({success: false, message: 'Esa hora ya está en la lista.'});
      return;
    }
    if (schedule.horas.length >= maxTimes) {
      setResult({success: false, message: `Puedes programar como máximo ${maxTimes} envíos por día.`});
      return;
    }
    setSchedule((prev) => ({...prev, horas: [...prev.horas, newTime].sort()}));
    setNewTime('');
  };

  const removeTime = (time) => setSchedule((prev) => ({...prev, horas: prev.horas.filter((current) => current !== time)}));

  const hasChanges = JSON.stringify(schedule) !== JSON.stringify(savedSchedule);

  const save = async () => {
    if (schedule.activo && schedule.dias.length === 0) {
      setResult({success: false, message: 'Elige al menos un día de la semana.'});
      return;
    }
    if (schedule.activo && schedule.horas.length === 0) {
      setResult({success: false, message: 'Agrega al menos una hora de envío.'});
      return;
    }
    setSaving(true);
    const data = await updateReminderSchedule(schedule);
    setSaving(false);
    if (data.error) {
      setResult({success: false, message: data.error});
      return;
    }
    applyLoaded(data.configuracion);
    let message = 'Los recordatorios quedaron desactivados.';
    if (data.configuracion.activo) {
      message = 'Los recordatorios se enviarán en los días y horas elegidos.';
    }
    setResult({success: true, message});
  };

  const discardChanges = () => setSchedule(savedSchedule);

  const loadPreview = async () => {
    setLoadingPreview(true);
    const data = await previewReminderDigest();
    setLoadingPreview(false);
    if (data.error) {
      setResult({success: false, message: data.error});
      return;
    }
    setPreview(data);
  };

  const sendNow = async () => {
    setConfirmSend(false);
    setSending(true);
    const data = await sendReminderDigestNow();
    setSending(false);
    if (data.error) {
      setResult({success: false, message: data.error});
      return;
    }
    setPreview(null);
    let message = 'Nadie tiene pendientes en este momento, así que no se envió ningún correo.';
    if (data.total > 0 && data.fallidos === 0) {
      message = `Se envió el resumen a ${data.enviados} ${data.enviados === 1 ? 'persona' : 'personas'}.`;
    }
    else if (data.total > 0) {
      message = `Se envió a ${data.enviados} de ${data.total} personas. ${data.fallidos} no se pudo enviar; intenta nuevamente más tarde.`;
    }
    setResult({success: data.fallidos === 0, message});
  };

  return {
    schedule, lastUpdate, loading, saving, loadError, hasChanges, maxTimes,
    newTime, setNewTime, toggleActive, toggleDay, addTime, removeTime, save, discardChanges,
    preview, loadingPreview, loadPreview, closePreview: () => setPreview(null),
    sending, confirmSend, openConfirmSend: () => setConfirmSend(true), closeConfirmSend: () => setConfirmSend(false), sendNow,
    result, closeResult: () => setResult(null),
  };
}

export default useReminderSettings;
