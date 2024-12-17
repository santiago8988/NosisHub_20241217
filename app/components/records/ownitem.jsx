'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import OwnItemType from './ownitetype'


const ownitem = ({label,value,identifier,setRecord,record,onDelete}) => {

  function handleChange(newIdentifier,checked) {
          /*console.log('desde checked',newIdentifier)
          console.log('checked',checked)*/
          if(checked){
            const identifierUpdate=[...record.identifier]
            identifierUpdate.push(newIdentifier)
            setRecord({...record,identifier:identifierUpdate})
          }

          if(!checked){
            const identifierUpdate=[...record.identifier]
            const filtered=identifierUpdate.filter(item => item !== newIdentifier);
            setRecord({...record,identifier:filtered})
          }
    }

  return (
    <li className='flex gap-3 mt-2'>
    <Checkbox
      id={label}
      className='peer'
      defaultChecked={identifier.includes(label)}
      checked={identifier.includes(label)}
      onCheckedChange={checked => handleChange(label,checked)}
    />
    <Label
      htmlFor={label}
      /*className='cursor-pointer peer-data-[state=checked]:text-gray-500 peer-data-[state=checked]:line-through'*/
      className='cursor-pointer  peer-data-[state=checked]:text-blue-500'
    >
      {label}
    </Label>
    <span className='ml-auto text-sm  peer-data-[state=checked]:text-blue-500'>
            <OwnItemType label={label} record={record} setRecord={setRecord} onDelete={onDelete}/>
    </span>
  </li>
  )
}

export default ownitem