import React, { useState } from 'react';
import './ManagerUpdateDetail.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

function ManagerUpdateDetail() {
  const [showFindTime, setShowFindTime] = useState(false);
  const [showFindChips, setShowFindChips] = useState(false);
  const [selectedChips, setSelectedChips] = useState(new Set());
  const [savedChips, setSavedChips] = useState(new Set());

  const roundToHour = (date) => {
    date.setMinutes(0);
    return date;
  };

  const [startTime, setStartTime] = useState(roundToHour(new Date()));
  const [endTime, setEndTime] = useState(roundToHour(new Date()));

  const handleChangeStartTime = (time) => {
    setStartTime(time);
  };

  const handleChangeEndTime = (time) => {
    setEndTime(time);
  };

  const toggleFindTime = () => {
    setShowFindTime(!showFindTime);
  };

  const toggleFindChips = () => {
    setShowFindChips(!showFindChips);
  };

  const handleSelectChip = (chip) => {
    setSelectedChips((prevSelectedChips) => {
      const newSelectedChips = new Set(prevSelectedChips);
      if (newSelectedChips.has(chip)) {
        newSelectedChips.delete(chip);
      } else {
        newSelectedChips.add(chip);
      }
      return newSelectedChips;
    });
  };

  const handleSaveChips = () => {
    setSavedChips(new Set(selectedChips));
    setShowFindChips(false);
  };

  const ChipButton = ({ chip }) => {
    const isSelected = selectedChips.has(chip);
    const chipClass = `ManagerUpdateBasic-Container-Chips-Button ${isSelected ? 'select-Chips' : ''}`;
    return (
      <button className={chipClass} onClick={() => handleSelectChip(chip)}>
        {chip}
      </button>
    );
  };
      
    return(
        <div className="ManagerUpdateDetail">
        <div className="ManagerUpdateDetail-Container">
        <div className='ManagerUpdateDetail-Container-Items'>

       {/* 카페 운영시간 */}
        <div className='ManagerUpdateDetail-Container-Time'>
            <div className='ManagerUpdateDetail-Container-Time-Text'>
            <h2>운영시간</h2>
            <button onClick={toggleFindTime}>수정</button>
            </div>
                <div className='ManagerUpdateDetail-Container-Time-labeling'>
                  <label>카페 시작 시간</label>
                </div>
                <div className='ManagerUpdateBasic-Container-Time-Input'>
                <DatePicker
                className='ManagerUpdateBasic-Container-DatePicker'
                selected={startTime}
                onChange={handleChangeStartTime}
                timeFormat="HH:mm"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="HH:mm"
              />
              </div>

              <div className='ManagerUpdateDetail-Container-Time-labeling'>
                  <label>카페 종료 시간</label>
                </div>
                <div className='ManagerUpdateBasic-Container-Time-Input'>
                <DatePicker
                className='ManagerUpdateBasic-Container-DatePicker'
                selected={startTime}
                onChange={handleChangeStartTime}
                timeFormat="HH:mm"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="HH:mm"
              />       
              </div>
             
              </div>


              <div className={`ManagerUpdateDetail-Container-Time Update-Container ${!showFindTime ? 'hidden' : ''}`}>
              <div className='ManagerUpdateDetail-Container-Time-Text'>
            <h2>운영시간 수정</h2>
            
            </div>
                <div className='ManagerUpdateDetail-Container-Time-labeling'>
                  <label>카페 시작 시간</label>
                </div>
                <div className='ManagerUpdateBasic-Container-Time-Input'>
                <DatePicker
                className='ManagerUpdateBasic-Container-DatePicker'
                selected={startTime}
                onChange={handleChangeStartTime}
                timeFormat="HH:mm"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="HH:mm"
              />
              </div>

              <div className='ManagerUpdateDetail-Container-Time-labeling'>
                  <label>카페 종료 시간</label>
                </div>
                <div className='ManagerUpdateBasic-Container-Time-Input'>
                <DatePicker
                className='ManagerUpdateBasic-Container-DatePicker'
                selected={startTime}
                onChange={handleChangeStartTime}
                timeFormat="HH:mm"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="HH:mm"
              />       
              </div>
              <div className='ManagerUpdateDetail-Container-Time-Button'>
              <button onClick={toggleFindTime}>취소</button>
              <button>저장</button>
              </div>
              </div>

              {/* 카페 특성 */}
          <div className='ManagerUpdateDetail-Container-Chips'>
            <div className='ManagerUpdateDetail-Container-Chips-labeling'>
              <h2>카페 특성</h2>
              <button onClick={toggleFindChips}>수정</button>
            </div>
            <div className='ManagerUpdateBasic-Container-Chips-Input'>
              {/* 저장된 특성만 출력 */}
              {Array.from(savedChips).map(chip => (
                <button key={chip} className='ManagerUpdateBasic-Container-Chips-Button'>{chip}</button>
              ))}
            </div>
          </div>

          {/* 카페 특성 수정 */}
          {showFindChips && (
            <div className='ManagerUpdateDetail-Container-Chips Update-Container'>
              <div className='ManagerUpdateDetail-Container-Chips-labeling'>
                <h2>카페 특성 수정</h2>
                
              </div>
              <div className='ManagerUpdateBasic-Container-Chips-Input'>
                {['조용함', '음악 없음', '편한 좌석', '디저트', '감성적', '콘센트'].map(chip => (
                  <ChipButton key={chip} chip={chip} />
                ))}
              </div>
              <div className='ManagerUpdateDetail-Container-Chips-Button'>
              <button onClick={toggleFindChips}>취소</button>
              <button onClick={handleSaveChips}>저장</button>
              </div>
            </div>
            
          )}
            
        </div>
      </div>
    </div>
  );
}

export default ManagerUpdateDetail;