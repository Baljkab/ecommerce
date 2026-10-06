import { deliveryStatuses, type DeliveryStatus } from "@/lib/admin-orders";

const colors: Record<DeliveryStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  shipping: "bg-blue-50 text-blue-700 ring-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function OrderDeliveryBadge({
  status,
}: {
  status: DeliveryStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${colors[status]}`}
    >
      {deliveryStatuses[status]}
    </span>
  );
}
