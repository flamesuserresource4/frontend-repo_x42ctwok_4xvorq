export default function PropertyCard({ item, currentUser, onContact, onLock }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/20">
        {item.images && item.images[0] ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/40 text-sm">No image</div>
        )}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
        <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between text-white/80 text-sm">
        <span>₹ {item.price?.toLocaleString?.('en-IN') || item.price}</span>
        <span>{item.location}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>Status: {item.status}</span>
        <span>Owner: {item.owner_name}</span>
      </div>
      <div className="flex gap-2 pt-2">
        {currentUser && currentUser.role === 'buyer' && (
          <>
            <button onClick={() => onContact(item)} className="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm disabled:opacity-60" disabled={item.status !== 'available'}>
              Contact owner
            </button>
            <button onClick={() => onLock(item)} className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-60" disabled={item.status !== 'available'}>
              Lock property
            </button>
          </>
        )}
        {currentUser && currentUser.role === 'owner' && (
          <span className="text-white/60 text-sm">Your property</span>
        )}
        {!currentUser && (
          <span className="text-white/60 text-sm">Login to contact or lock</span>
        )}
      </div>
    </div>
  )
}
