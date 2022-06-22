import React, { useEffect, useState, useTransition } from "react";
import "./SearchBar.css";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce } from 'usehooks-ts'


function SearchBar({ placeholder, data }) {
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState('');
    const debouncedText = useDebounce(wordEntered, 1500)
    const [serchStrings, setserchStrings] = useState([])
    const [showHistory, setShowHistory] = useState(false)
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (wordEntered && serchStrings.indexOf(debouncedText) === -1) {
            setserchStrings(serchStrings => [...serchStrings, debouncedText])
        }

    }, [debouncedText])

    useEffect(() => {

        setWordEntered(wordEntered);
        const newFilter = data.filter((value) => {
            return value.title.toLowerCase().includes(wordEntered.toLowerCase());
        });

        if (wordEntered === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    }, [wordEntered])




    const handleFilter = (event) => {
        startTransition(() => {
            const searchWord = event.target.value;
            setWordEntered(searchWord);
            const newFilter = data.filter((value) => {
                return value.title.toLowerCase().includes(searchWord.toLowerCase());
            });
            if (searchWord === "") {
                setFilteredData([]);
            } else {
                setFilteredData(newFilter);
            }
        })
    };

    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    };

    const showSearchStrings = () => {
        setShowHistory(!showHistory)
    }

    const handleClickHistory = (e) => {
        setWordEntered(e.currentTarget.value)
        setShowHistory(false)
    }



    return (
        <div className="search" >
            <div className="searchInputs">
                <div className="input_history">
                    <input
                        type="text"
                        onClick={showSearchStrings}
                        placeholder={placeholder}
                        value={wordEntered}
                        onChange={handleFilter}
                    />
                    <div>
                        {showHistory ? serchStrings.map((item, i) =>
                            <input
                                readOnly
                                key={i}
                                className="history"
                                value={item}
                                onClick={handleClickHistory}
                            />) : null}
                    </div>
                </div>
                <div className="searchIcon">
                    {filteredData.length === 0 ? (
                        <SearchIcon />
                    ) : (
                        <CloseIcon id="clearBtn" onClick={clearInput} />
                    )}
                </div>
            </div>
            {filteredData.length !== 0 && (
                <div className="dataResult">
                    {isPending ? <div>Loading...</div> : filteredData.slice(0, 10).map((value, key) => {
                        return (
                            <a key={key} className="dataItem" href={value.link} target="_blank">
                                <p>{value.title} </p>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SearchBar;

