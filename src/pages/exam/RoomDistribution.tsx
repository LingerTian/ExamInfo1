import { useState, useEffect } from 'react';
import { Card, Button, Input, Checkbox, Space, message, Modal } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

interface ExamRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  selected: boolean;
  seats: Seat[];
}

interface Seat {
  id: number;
  number: string;
  selected: boolean;
  assigned: boolean;
}

interface AssignmentResult {
  examId: number;
  totalRooms: number;
  totalSeats: number;
  assignedSeats: number;
  rooms: {
    id: number;
    name: string;
    location: string;
    seatsAssigned: number;
  }[];
}

const generateMockRooms = (count: number): ExamRoom[] => {
  const rooms: ExamRoom[] = [];
  
  for (let i = 1; i <= count; i++) {
    const capacity = Math.floor(Math.random() * 30) + 20; // 20-50 seats per room
    const seats: Seat[] = [];
    
    for (let j = 1; j <= capacity; j++) {
      seats.push({
        id: j,
        number: `座位${j}`,
        selected: false,
        assigned: false,
      });
    }
    
    rooms.push({
      id: i,
      name: `考场 ${i}`,
      capacity,
      location: `教学楼 ${String.fromCharCode(64 + Math.floor(i / 10) + 1)} 层 ${i % 10 + 1} 室`,
      selected: false,
      seats,
    });
  }
  
  return rooms;
};

const RoomDistribution: React.FC = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState<ExamRoom[]>(generateMockRooms(15));
  const [filteredRooms, setFilteredRooms] = useState<ExamRoom[]>([]);
  const [searchText, setSearchText] = useState('');
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResult | null>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const intl = useIntl();

  const examId = new URLSearchParams(location.search).get('examId');

  useEffect(() => {
    if (searchText) {
      setFilteredRooms(rooms.filter(room => 
        room.name.toLowerCase().includes(searchText.toLowerCase())
      ));
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchText, rooms]);

  const handleRoomSelect = (roomId: number) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          selected: !room.selected,
          seats: room.seats.map(seat => ({
            ...seat,
            selected: !room.selected ? false : seat.selected,
          })),
        };
      }
      return room;
    }));
  };

  const handleSeatSelect = (roomId: number, seatId: number) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          selected: true,
          seats: room.seats.map(seat => {
            if (seat.id === seatId) {
              return {
                ...seat,
                selected: !seat.selected,
              };
            }
            return seat;
          }),
        };
      }
      return room;
    }));
  };

  const handleSelectAllSeats = (roomId: number, selectAll: boolean) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          selected: selectAll,
          seats: room.seats.map(seat => ({
            ...seat,
            selected: selectAll,
          })),
        };
      }
      return room;
    }));
  };

  const handleCompleteAssignment = () => {
    const selectedRooms = rooms.filter(room => room.selected);
    if (selectedRooms.length === 0) {
      message.warning('请至少选择一个考场');
      return;
    }

    const totalSeats = selectedRooms.reduce((sum, room) => sum + room.capacity, 0);
    const assignedSeats = selectedRooms.reduce((sum, room) => 
      sum + room.seats.filter(seat => seat.selected).length,
    0);

    const result: AssignmentResult = {
      examId: Number(examId) || 0,
      totalRooms: selectedRooms.length,
      totalSeats,
      assignedSeats,
      rooms: selectedRooms.map(room => ({
        id: room.id,
        name: room.name,
        location: room.location,
        seatsAssigned: room.seats.filter(seat => seat.selected).length,
      })),
    };

    setAssignmentResult(result);
    setResultVisible(true);

    // Mark seats as assigned
    setRooms(rooms.map(room => {
      if (room.selected) {
        return {
          ...room,
          seats: room.seats.map(seat => ({
            ...seat,
            assigned: seat.selected,
          })),
        };
      }
      return room;
    }));

    message.success('考场分配完成');
  };

  const handleResultClose = () => {
    setResultVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{intl.formatMessage({ id: 'exam.roomDistribution', defaultMessage: '考场分布' })}</h2>
        <Button type="primary" onClick={handleCompleteAssignment}>
          {intl.formatMessage({ id: 'exam.completeAssignment', defaultMessage: '完成分配' })}
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder={intl.formatMessage({ id: 'exam.searchRoom', defaultMessage: '搜索考场名称' })}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
        {filteredRooms.map(room => (
          <Card
            key={room.id}
            title={room.name}
            bordered={false}
            style={{
              backgroundColor: room.selected ? '#52c41a' : '#ffffff',
              color: room.selected ? '#ffffff' : '#000000',
            }}
            extra={
              <Checkbox 
                checked={room.selected} 
                onChange={() => handleRoomSelect(room.id)}
                style={{ color: room.selected ? '#ffffff' : '#000000' }}
              >
                {intl.formatMessage({ id: 'exam.selectRoom', defaultMessage: '选择考场' })}
              </Checkbox>
            }
          >
            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: '4px 0' }}>
                <strong>{intl.formatMessage({ id: 'exam.location', defaultMessage: '位置' })}:</strong> {room.location}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>{intl.formatMessage({ id: 'exam.capacity', defaultMessage: '座位数' })}:</strong> {room.capacity}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>{intl.formatMessage({ id: 'exam.selectedSeats', defaultMessage: '已选座位' })}:</strong> {room.seats.filter(seat => seat.selected).length}
              </p>
            </div>

            {room.selected && (
              <div>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'exam.seats', defaultMessage: '座位' })}</span>
                  <Button 
                    type="text" 
                    onClick={() => handleSelectAllSeats(room.id, !room.seats.every(seat => seat.selected))}
                    style={{ color: '#ffffff' }}
                  >
                    {room.seats.every(seat => seat.selected) ? 
                      intl.formatMessage({ id: 'exam.unselectAll', defaultMessage: '取消全选' }) : 
                      intl.formatMessage({ id: 'exam.selectAll', defaultMessage: '全选' })}
                  </Button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 8 }}>
                  {room.seats.map(seat => (
                    <div
                      key={seat.id}
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: seat.selected ? '#389e0d' : seat.assigned ? '#fa8c16' : '#ffffff',
                        color: seat.selected || seat.assigned ? '#ffffff' : '#000000',
                        border: seat.selected ? '2px solid #ffffff' : '1px solid #e8e8e8',
                      }}
                      onClick={() => handleSeatSelect(room.id, seat.id)}
                    >
                      {seat.number}
                      {seat.selected && <CheckOutlined style={{ marginLeft: 4 }} />}
                      {seat.assigned && !seat.selected && <CloseOutlined style={{ marginLeft: 4 }} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal
        title={intl.formatMessage({ id: 'exam.assignmentResult', defaultMessage: '分配结果' })}
        visible={resultVisible}
        onCancel={handleResultClose}
        footer={null}
        width={600}
      >
        {assignmentResult && (
          <div>
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{intl.formatMessage({ id: 'exam.summary', defaultMessage: '分配 summary' })}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <p><strong>{intl.formatMessage({ id: 'exam.totalRooms', defaultMessage: '总考场数' })}:</strong> {assignmentResult.totalRooms}</p>
                <p><strong>{intl.formatMessage({ id: 'exam.totalSeats', defaultMessage: '总座位数' })}:</strong> {assignmentResult.totalSeats}</p>
                <p><strong>{intl.formatMessage({ id: 'exam.assignedSeats', defaultMessage: '已分配座位数' })}:</strong> {assignmentResult.assignedSeats}</p>
                <p><strong>{intl.formatMessage({ id: 'exam.utilization', defaultMessage: '座位利用率' })}:</strong> {(assignmentResult.assignedSeats / assignmentResult.totalSeats * 100).toFixed(2)}%</p>
              </div>
            </div>

            <h3>{intl.formatMessage({ id: 'exam.roomDetails', defaultMessage: '考场详情' })}</h3>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {assignmentResult.rooms.map(room => (
                <div key={room.id} style={{ marginBottom: 12, padding: 12, border: '1px solid #e8e8e8', borderRadius: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong>{room.name}</strong>
                    <span style={{ padding: '2px 8px', backgroundColor: '#e6f7ff', borderRadius: 4 }}>
                      {room.seatsAssigned}/{assignmentResult.rooms.find(r => r.id === room.id)?.capacity} 个座位
                    </span>
                  </div>
                  <p style={{ margin: '4px 0' }}>{intl.formatMessage({ id: 'exam.location', defaultMessage: '位置' })}: {room.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomDistribution;