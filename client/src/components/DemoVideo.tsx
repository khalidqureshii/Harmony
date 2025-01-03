const DemoVideo = () => {
  return (
    <div><iframe
    className="w-full h-[315px]"
    src="https://www.youtube.com/embed/vflWLItnwfA?si=ifZysP5TeNp2Kpx6"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
></iframe>

<iframe className="w-full h-[315px]" src="https://www.youtube.com/embed/wQn-Yfl2p-c?si=iLpHQj42KgmL5TIr" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
</div>
  )
}

export default DemoVideo