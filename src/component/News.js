import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"


const News = (props) => {
  const [articles,setArticals] = useState([]);
  const [loading,setLoading] = useState(true);
  const [page,setPage] = useState(1);
  const [totalResults,setTotalResults] = useState(0);
  const capitalizedFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews= async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=64c3664ede214a8b82993f3df90b344e&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parseData = await data.json();
    setArticals(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(()=>{
    document.title = `${capitalizedFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  },[])

  // const handlePrevClick = async () => {
  //   setPage(page-1);  
  //   updateNews();
  // }
  // const handleNextClick = async () => {
  //   setPage(page+1);
  //   updateNews();
  // }

  const fetchMoreData = async () => {
    setPage(page+1)
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=64c3664ede214a8b82993f3df90b344e&page=${page+1}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parseData = await data.json();
    setArticals(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults);
  };

    return (
      <>
        <h1 className='text-center' style={{margin: '35px 0px', marginTop: '90px'}}>NewsMonkeys -Top {capitalizedFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}>

          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={page<=1} type="button" onClick={handlePrevClick} className="btn btn-sm btn-dark"> &larr; Previous</button>
        <button disabled={page + 1> Math.ceil(totalResults/props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button></div> */}
      </>
    )
}
News.defaultProps = {
  country: 'in',
  pageSize: 5,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}
export default News
