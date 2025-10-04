export default function LocationsSlots({ locations, slots }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">
        Parking Locations and Slots
      </h3>
      {locations.map((location) => (
        <div key={location._id} className="mb-6">
          <h4 className="text-lg font-semibold">
            {location.name} ({location.address})
          </h4>
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Slot Number</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(slots[location._id] || []).map((slot) => (
                <tr key={slot._id} className="hover:bg-gray-50">
                  <td className="border p-2">{slot.slotNumber}</td>
                  <td className="border p-2">
                    {slot.isAvailable ? (
                      <span className="text-[var(--secondary)]">Empty</span>
                    ) : (
                      <span className="text-red-500">Booked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
