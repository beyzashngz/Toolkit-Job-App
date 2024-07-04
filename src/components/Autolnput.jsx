import { useSelector } from 'react-redux'

const AutoInput = ({label, name}) => {
    const {jobs} = useSelector((store) => store.job)

    //1- sadece istediğimiz değerlerinden oluşan dizi
    const arr = jobs.map((job) => job[name])

    //2-dizideki tekrar eden elemanları kadlır
    const set = new Set(arr)

    //3-setin döndürdüğü nesneyi diziye çevirme
    const options = Array.from(set)

  return (
    <div>
      <label htmlFor={label}> {label} </label>

      <input list={name} name={name} id={label} type="text" required/>

      <datalist id={name}>
        {options.map((item) => (
          <option value={item} />
        ))}
      </datalist>
    </div>
  )
}

export default AutoInput
