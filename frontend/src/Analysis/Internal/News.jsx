import React from 'react'
import { formatDistanceToNow } from 'date-fns';
const News = ({data}) => {
   React.useEffect(() => {
    console.log(data)
},[])
  return (
    <section id="news" className="w-full mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Market News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(!data.length||data.length==0)?<></>:data.map((item) => (
          <a
            key={item.uuid}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
                {(item.thumbnail)?
              <img
                src={item.thumbnail.resolutions[0].url}
                alt={item.title}
                className="object-cover w-full h-full"
              />:<img 
               className="object-cover w-full h-full"
              src="https://media.istockphoto.com/id/1369150014/vector/breaking-news-with-world-map-background-vector.jpg?s=612x612&w=0&k=20&c=9pR2-nDBhb7cOvvZU_VdgkMmPJXrBQ4rB1AkTXxRIKM=" />
              }
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{item.publisher}</span>
                <span>{formatDistanceToNow(new Date(item.providerPublishTime * 1000))} ago</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default News