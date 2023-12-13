// eslint-disable-next-line react/prop-types
const StatusLabel = ({ status }) => {
  let statusLabel = "";
  let statusColor = "";
  switch (status) {
    case "accepted":
      statusLabel = "Đã xác nhận";
      statusColor = "#075985";
      break;
    case "processing":
      statusLabel = "Chờ xác nhận";
      statusColor = "#f3a638";
      break;
    case "rejected":
      statusLabel = "Đã hủy";
      statusColor = "#e3503e";
      break;
    default:
      statusLabel = "Đã giao";
      statusColor = "#4cb64c";
      break;
  }
  return (
    <div
      className="px-4 py-3 font-semibold text-center text-white rounded-2xl"
      style={{ backgroundColor: statusColor }}
    >
      {statusLabel}
    </div>
  );
};

export default StatusLabel;
