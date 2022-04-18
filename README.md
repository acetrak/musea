# 接口文档

https://mapi.acebook.cc

https://music.163.com/song/media/outer/url?id=1901371647.mp3

歌单 ( 网友精选碟 )

```
接口地址 : /top/playlist

调用例子 : /top/playlist?limit=10&order=new
```

---

热门歌手

```
接口地址 : /top/artists

调用例子 : /top/artists?offset=0&limit=30
```

所有榜单

```
说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist

调用例子 : /toplist

```

获取歌单所有歌曲

```
说明 : 由于网易云接口限制，歌单详情只会提供 10 首歌，通过调用此接口，传入对应的歌单id，即可获得对应的所有歌曲

必选参数 : id : 歌单 id

可选参数 : limit : 限制获取歌曲的数量，默认值为当前歌单的歌曲数量

可选参数 : offset : 默认值为0

接口地址 : /playlist/track/all

调用例子 : /playlist/track/all?id=24381616&limit=10&offset=1

```

1. https://mapi.acebook.cc/playlist/detail?id=19723756
2. 拿第一步返回的trackIds 再次请求 /song/detail?ids=347230,347231

歌手热门 50 首歌曲
说明 : 调用此接口,可获取歌手热门 50 首歌曲

必选参数 :

id : 歌手 id

接口地址 : /artist/top/song

调用例子 : /artist/top/song?id=6452

https://mapi.acebook.cc/artist/album?id=6452&limit=30
https://mapi.acebook.cc/top/artists?offset=0&limit=30
