export function buildDayJustifications(comments) {
  const justifications = (comments || []).filter((comment) => comment.tipo === 'JUSTIFICACION');
  const map = {};
  const list = [];
  justifications.forEach((comment) => {
    const key = comment.fecha_justificada || 'HOTEL';
    if (!map[key]) {
      map[key] = comment.descripcion;
      list.push({fecha: comment.fecha_justificada || null, descripcion: comment.descripcion});
    }
  });
  return {map, list};
}
