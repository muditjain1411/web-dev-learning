import React from 'react'

const Card = (props) => {
  return (
    <div key={props.key} className='flex flex-col items-center border-1 shadow-slate-200xl max-w-[90%] md:max-w-xs h-auto bg-gray-50 rounded-2xl relative'>
      <img src={props.src} alt="" className='w-full h-[12em] rounded-xl object-cover' />
      <div className='m-3'>
      <h3 className='Tfont'>{props.title}</h3>
      <div className='text-justify mb-4'>{props.desc}</div>
      </div>
      <div className='text-[12px] tracking-widest absolute bottom-2 left-3 text-gray-600'>Uploaded By User: {props.userid}</div>
    </div>
  )
}

export default Card