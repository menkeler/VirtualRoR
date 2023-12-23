import React from 'react'

const ViewCopies = () => {
  return (
    <>
        {/* Only show View Copies of an returnable item*/}
            <button className="btn" onClick={()=>document.getElementById('my_modal_5').showModal()}>open modal</button>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                <form method="dialog">        
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
            </dialog>
    </>
  )
}

export default ViewCopies