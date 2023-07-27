import {useEffect, useState} from "react";
import {fetchPopularRepos} from "./api";
import { ProgressBar } from  'react-loader-spinner'

const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];

const LanguageTabs = ({selectedLanguages, setSelectedLanguages, loading}) => {
    return (
        <ul className='languages'>
            {languages.map((language, index) => (
                <li
                    key={index}
                    style={{
                        color: selectedLanguages === language ? '#d0021b' : '#000000',
                        cursor: !loading ? 'pointer' : 'default',
                        userSelect: !loading ? 'auto' : 'none',
                }}
                    onClick={() => {
                        if(!loading) {
                            setSelectedLanguages(language)
                        }
                    }}
                >
                    {language}
                </li>
            ))}
        </ul>
    )
}

const PopularList = ( {repos} ) => {
    return (
        <ul className='popular-list'>
            {repos ? repos.map((repo, index) => {
                return (
                    <li key={repo.id} className='popular-item'>
                        <div className='popular-rank'>#{index + 1}</div>
                        <ul>
                            <li><img className='avatar' src={repo.owner.avatar_url} alt="Avatar"/></li>
                            <li><a href={repo.html_url} target='_blank'>{repo.name}</a></li>
                            <li>@{repo.owner.login}</li>
                            <li>{repo.stargazers_count}</li>
                        </ul>
                    </li>
                )
            }) :  <p>Ooops...</p>}
        </ul>
        )
}

const Popular = () => {
    const lastVisitedPage = sessionStorage.getItem('URL');
    const [selectedLanguages, setSelectedLanguages] = useState(lastVisitedPage || 'All');
    const [loading, setLoading] = useState(false);
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        sessionStorage.setItem("URL", selectedLanguages)
        setLoading(true);
        fetchPopularRepos(selectedLanguages)
            .then(data => {
                setRepos(data);
            })
            .catch(error => setError(error))
            .finally(() => setLoading(false));

    }, [selectedLanguages])


    if(error) {
        return <p>{error}</p>
    }

    return (
        <div>
            <LanguageTabs selectedLanguages={selectedLanguages} setSelectedLanguages={setSelectedLanguages} loading ={loading}/>
            {!loading ? (
                <PopularList repos={repos} />
            ) : (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>
                    <ProgressBar
                        height="80"
                        width="80"
                        ariaLabel="progress-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass="progress-bar-wrapper"
                        borderColor = '#F4442E'
                        barColor = '#51E5FF'
                    />
                </div>
            )}
        </div>
    );
};

export default Popular;
