import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserSearch.css";
import UserSearchInput from "./UserSearchInput";
import { locationSearch } from "../apis/Search";

const { kakao } = window;

const UserSearch = () => {
  const [showInput, setShowInput] = useState(false);
  const [map, setMap] = useState(null);
  const [showMarker, setShowMarker] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [activeOverlays, setActiveOverlays] = useState([]);

  const toggleUserSearchInput = () => {
    setShowInput(!showInput);
  };

  function clearMarkersAndOverlays() {
    showMarker.forEach((marker) => marker.setMap(null));
    setShowMarker([]);

    activeOverlays.forEach((overlay) => overlay.setMap(null));
    setActiveOverlays([]);
  }

  const handleLocationData = (data) => {
    console.log("Received data:", data);
    clearMarkersAndOverlays();

    data.locations.forEach((location) => {
      const cafeInfo = data.searchCafes.find(
        (cafe) => cafe.cafeName === location.cafeName
      );

      if (!cafeInfo) {
        console.error("No cafeInfo found for:", location.cafeName);
        return;
      }

      console.log("Creating marker for:", location.cafeName);
      const position = new kakao.maps.LatLng(
        location.latitude,
        location.longtitude
      );

      const marker = new kakao.maps.Marker({
        map: map,
        position: position,
        title: location.cafeName,
        image: markerImage,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        const overlayElement = document.createElement("div");
        overlayElement.innerHTML = `
          <div class="wrap">
            <div class="info">
              <div class="title">
                ${cafeInfo.cafeName}
                <div class="close" title="닫기"></div>
              </div>
              <div class="body">
                <div class="img">
                  <img src="data:image/;base64,${cafeInfo.cafeReqImg}" width="73" height="70">
                </div>
                <div class="desc">
                  <div class="ellipsis">${cafeInfo.address}</div>
                  <div class="jibun ellipsis">운영 시간: ${cafeInfo.startTime} ~ ${cafeInfo.endTime}</div>
                  <div class="ellipsis">전화번호: ${location.cafeTel}</div>
                </div>
              </div>
            </div>
          </div>`;

        const closeBtn = overlayElement.querySelector(".close");
        closeBtn.onclick = () => overlay.setMap(null);

        const overlay = new kakao.maps.CustomOverlay({
          content: overlayElement,
          map: map,
          position: marker.getPosition(),
        });

        activeOverlays.forEach((overlay) => overlay.setMap(null));
        setActiveOverlays([overlay]);
      });

      setShowMarker((prevMarkers) => [...prevMarkers, marker]);
    });
  };

  var imageSrc = "/assets/marker_red_2.png", // 마커이미지의 주소입니다
    imageSize = new kakao.maps.Size(57, 60), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(27, 60) };
  var markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption
  );

  useEffect(() => {
    const initMap = (lat, lon) => {
      const mapContainer = document.getElementById("map"); // 지도를 표시할 div
      const mapOption = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 3,
      };

      const newMap = new kakao.maps.Map(mapContainer, mapOption);
      setMap(newMap);

      kakao.maps.event.addListener(newMap, "center_changed", () => {
        const center = newMap.getCenter();
        setMapCenter({ lat: center.getLat(), lng: center.getLng() });
      });
    };

    const initMapAtUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            initMap(lat, lon);
          },
          () => {
            console.error("Cannot access user location");
            initMap(37.479943, 126.88268);
          }
        );
      }
    };

    initMapAtUserLocation();
  }, []);
  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          if (map) {
            map.setCenter(new kakao.maps.LatLng(lat, lon));
          } else {
            console.error("Error: map is not initialized");
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    if (map) {
      const centerChangedListener = kakao.maps.event.addListener(
        map,
        "center_changed",
        () => {
          const center = map.getCenter();
          console.log("지도 중심 변경됨:", center.getLat(), center.getLng());
          setMapCenter({ lat: center.getLat(), lng: center.getLng() });
        }
      );
      return () => {
        kakao.maps.event.removeListener(centerChangedListener);
      };
    }
  }, [map]);
  const handleSearchInCurrentMap = () => {
    if (map) {
      // 현재 중심좌표 get
      const currentCenter = map.getCenter();
      const lng = currentCenter.getLng();
      const lat = currentCenter.getLat();
      console.log("현재 위치 근처 검색:", lat, lng);
      clearMarkersAndOverlays();
      locationSearch(lng, lat)
        .then((response) => {
          const { locations, searchCafes } = response.data.data;

          locations.forEach((location) => {
            const cafeInfo = searchCafes.find(
              (cafe) => cafe.cafeName === location.cafeName
            );

            if (!cafeInfo) {
              console.error("No cafeInfo found for:", location.cafeName);
              return;
            }

            const position = new kakao.maps.LatLng(
              location.latitude,
              location.longtitude
            );

            const marker = new kakao.maps.Marker({
              map: map,
              position: position,
              title: location.cafeName,
              image: markerImage,
            });

            kakao.maps.event.addListener(marker, "click", () => {
              const overlayElement = document.createElement("div");
              overlayElement.innerHTML = `
                <div class="wrap">
                  <div class="info">
                    <div class="title">
                      ${cafeInfo.cafeName}
                      <div class="close" title="닫기"></div>
                    </div>
                    <div class="body">
                      <div class="img">
                        <img src="data:image/;base64,${cafeInfo.cafeReqImg}" width="73" height="70">
                      </div>
                      <div class="desc">
                        <div class="ellipsis">${cafeInfo.address}</div>
                        <div class="jibun ellipsis">운영 시간: ${cafeInfo.startTime} ~ ${cafeInfo.endTime}</div>
                        <div class="ellipsis">전화번호: ${location.cafeTel}</div>
                      </div>
                    </div>
                  </div>
                </div>`;

              const closeBtn = overlayElement.querySelector(".close");
              closeBtn.onclick = () => overlay.setMap(null);

              const overlay = new kakao.maps.CustomOverlay({
                content: overlayElement,
                map: map,
                position: position,
              });

              activeOverlays.forEach((overlay) => overlay.setMap(null));
              setActiveOverlays([overlay]);
            });

            setShowMarker((prevMarkers) => [...prevMarkers, marker]);
          });
        })
        .catch((error) => {
          console.error("Location search error:", error);
        });
    } else {
      console.error("No map reference available");
    }
  };

  function clearMarkersAndOverlays() {
    showMarker.forEach((marker) => {
      marker.setMap(null);
    });

    setShowMarker([]);
  }

  return (
    <div className="usersearch">
      <div className="map_nav">
        <div className="user_search">
          <div id="map"></div>
        </div>

        <div className="searchnav">
          <Link to="/user">
            <div className="searchnav_to_home">
              <img src="/assets/home.png" alt="home" />
              <h5>HOME</h5>
            </div>
          </Link>
          <div
            className="searchnav_map"
            onClick={() => setShowInput(!showInput)}
          >
            <img src="/assets/searchnav_map.png" alt="search map" />
            <h5>MAP</h5>
          </div>
          <div className="searchnav_time">
            <Link to="/user/reservationstatus">
              <img src="/assets/searchnav_time.png" alt="search time" />
              <h5>
                실시간 예약
                <br /> 현황
              </h5>
            </Link>
          </div>
          <div className="searchnav_mypage">
            <Link to="/user/myinfo">
              <img src="/assets/searchnav_mypage.png" alt="search mypage" />
              <h5>마이 페이지</h5>
            </Link>
          </div>
          <div className="searchnav_calendar">
            <Link to="/user/myreservation">
              <img src="/assets/searchnav_calendar.png" alt="search calendar" />
              <h5>
                날짜별 예약
                <br /> 내역 조회
              </h5>
            </Link>
          </div>
          <div className="map_button">
            <button onClick={handleSearchInCurrentMap} className="map_button1">
              현 지도에서 검색
            </button>
            <button onClick={handleClick} className="map_button2">
              <img src="/assets/search-target.png" alt="search target" />
            </button>
          </div>
        </div>
        {showInput && (
          <div className="searchnav-right">
            <UserSearchInput
              onClose={toggleUserSearchInput}
              onLocationDataReceived={handleLocationData}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default UserSearch;
// git push용 주석
