export default async function sitemap(){
    const  baseurl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`

    const response1 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/currentaffairs`,
    { cache: 'no-store' }
    ) 
    const data1 = await response1.json()
    const affairs = data1.data.affairs;
    const affairsUrl = affairs.map((affairs) => ({
        url: `${baseurl}/currentaffairs/${affairs._id}`,
        lastModified: affairs.updatedAt,
        priority: 0.7, // Example priority value
    }));

    const response2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/News`,
    { cache: 'no-store' }
    ) 
    const data2 = await response2.json()
    const news = data2.data.news;
    const newsUrl = news.map((news) => ({
        url: `${baseurl}/News/${news._id}`,
        lastModified: news.updatedAt,
        priority: 0.7, // Example priority value
    }));

    const response3 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pdfs`,
    { cache: 'no-store' }
    ) 
    const data3 = await response3.json()
    const pdf = data3.data.pdf;
    const pdfUrl = pdf.map((pdf) => ({
        url: `${baseurl}/pdfs/${pdf._id}`,
        lastModified: pdf.updatedAt,
        priority: 0.6, // Example priority value
    }));

    const response4 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/test`,
    { cache: 'no-store' }
    ) 
    const data4 = await response4.json()
    const tests = data4.data.tests;
    const testsUrl = tests.map((tests) => ({
        url: `${baseurl}/test/${tests._id}`,
        lastModified: tests.createdAt,
        priority: 0.5, // Example priority value
    }));

    const response5 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest`,
    { cache: 'no-store' }
    ) 
    const data5 = await response5.json()
    const dailytest = data5.data.dailytest;
    const dailytestUrl = dailytest.map((dailytest) => ({
        url: `${baseurl}/test/${dailytest._id}`,
        lastModified: dailytest.createdAt,
        priority: 0.7, // Example priority value
    }));

    return [
        {
            url: baseurl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0, // Example priority value
        },
        {
            url: `${baseurl}/test`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9, // Example priority value
        },
        {
            url: `${baseurl}/currentaffairs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9, // Example priority value
        },
        {
            url: `${baseurl}/News`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9, // Example priority value
        },
        {
            url: `${baseurl}/pdfs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8, // Example priority value
        },
        {
            url: `${baseurl}/login`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8, // Example priority value
        },
        {
            url: `${baseurl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8, // Example priority value
        },

        ...affairsUrl,
        ...newsUrl,
        ...pdfUrl,
        ...testsUrl,
        ...dailytestUrl,
    ];
}
