import Select from "../components/Select";
import { statusOpt, typeOpt, sortOpt } from "../utils/constants";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setLoading, setError, setJobs } from "../redux/slices/jobSlice";

const Filter = () => {
  const [text, setText] = useState();
  const [debouncedText, setDebouncedText] = useState();
  const [sort, setSort] = useState();
  const [status, setStatus] = useState();
  const [type, setType] = useState();

  const dispatch = useDispatch();

  //DEBOUNCE
  // her tuşta filtlereme, her tuş için sayaç başlatma ve süre bitince istek atma
  useEffect(() => {
    if (text === undefined) return;

    // bir sayaç başlat ve sayaç durunca işlem yap
    const timer = setTimeout(() => setDebouncedText(text), 500);

    // süre bitmeden tekrar useEffext çalışırsa (yeni sayaç başlaması) önceki sayacı iptal et baştan saymaya başla
    return () => clearTimeout(timer);
  }, [text]);

  //filtreleeme veya sıralama için state değiştiğinde apidan güncel veri alma
  useEffect(() => {
    const sortP =
      sort === "a-z" || sort === "z-a"
        ? "company"
        : sort === "En Yeni" || sort === "En Eski"
        ? "date"
        : undefined;

    const orderP =
      sort === "a-z" || sort === "En Eski"
        ? "asc"
        : sort === "z-a" || sort === "En Yeni"
        ? "desc"
        : undefined;

    const params = {
      q: debouncedText,
      status: status || undefined,
      type: type || undefined,
      _sort: sortP,
      _order: orderP,
    };

    dispatch(setLoading());

    api
      .get("/jobs", { params })
      .then((res) => dispatch(setJobs(res.data)))
      .catch((err) => dispatch(setError(err.message)));
  }, [debouncedText, status, sort, type]);

  // bütün stateleri sıfırla
  const handleReset = () => {
    setDebouncedText();
    setText();
    setType();
    setStatus();
    setSort();
  };

  return (
    <div className="filter-sec">
      <h2>Filtreleme Formu</h2>
      <form onReset={handleReset}>
        <div>
          <label>Ara</label>
          <input onChange={(e) => setText(e.target.value)} type="text" />
        </div>

        <Select
          label="Durum"
          options={statusOpt}
          fn={(e) => setStatus(e.target.value)}
        />
        <Select
          label="Tür"
          options={typeOpt}
          fn={(e) => setType(e.target.value)}
        />
        <Select
          label="Sırala"
          options={sortOpt}
          fn={(e) => setSort(e.target.value)}
        />

        <Button type="reset" text="Filtreleri Sıfırla" />
      </form>
    </div>
  );
};

export default Filter;
