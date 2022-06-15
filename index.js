const cheerio = require('cheerio')
const fs = require('fs')
const https = require('https')

const TIKTOK_VIDEO_URL = 'https://www.tiktok.com/@c0rnonthec0bb/video/7045472113905487110'

const fetchVideo = async () => {
  const res = await fetch(TIKTOK_VIDEO_URL)
  const data = await res.text()
  return data
}

const getUrl = async () => {
  const htmlData = await fetchVideo()
  const $ = cheerio.load(htmlData)
  const raw = $("#SIGI_STATE")[0].children[0].data
  const json = JSON.parse(raw)
  return json.ItemList.video.preloadList[0].url
}

const downloadFile = async (url) => {
  console.log('Download started...')
  const fileStream = fs.createWriteStream('./test.mp4')
  https.get(url, (res) => {
    res.pipe(fileStream)
    fileStream.on('finish', () => {
      fileStream.close()
      console.log('Download complete.')
    })
  })
}

const exec = async () => {
  const url = await getUrl()
  downloadFile(url)
}

exec()
