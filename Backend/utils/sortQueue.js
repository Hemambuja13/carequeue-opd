// Higher score = seen earlier
const severityWeight = { High: 100, Medium: 50, Low: 10 };

export const calculateScore = (appointment) => {
  const sevScore = severityWeight[appointment.severity] || 0;
  const ageScore = appointment.age >= 60 ? 20 : appointment.age <= 12 ? 15 : 0;
  // Earlier bookings (older createdAt) get a slight boost for "waiting time"
  const waitScore = -new Date(appointment.createdAt).getTime() / 1e12;
  return sevScore + ageScore + waitScore;
};

// Assigns queueNo + slot to a list of today's appointments
export const assignQueueAndSlots = (appointments) => {
  const sorted = [...appointments].sort((a, b) => calculateScore(b) - calculateScore(a));

  const startHour = 9;
  const startMinute = 0;
  const minutesPerSlot = 5;

  return sorted.map((appt, index) => {
    const totalMinutes = startMinute + index * minutesPerSlot;
    const hour = startHour + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    const slot = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;

    return {
      _id: appt._id,
      queueNo: index + 1,
      slot,
    };
  });
};