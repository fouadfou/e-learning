import React from 'react'

const Email = ({absence}) => {
  return (
    <html>
       <div className='flex flex-col gap-3'>
        <h1 className='text-xl font-bold'>Votre enfant est absent</h1>
        <p>Votre enfant, <b>"{absence.eleve_nom} {absence.eleve_prenom}"</b>, est absent lors du cours de <b>"{absence.matiere_name}"</b> enseigné par <b>"M. {absence.ensg_nom} {absence.ensg_prenom}"</b></p>
        <p><b>Date de l'absence : </b>{absence.date_abs}</p>
        </div>
    </html>
  )
}

export default Email