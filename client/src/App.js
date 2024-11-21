import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  background-color: #fafafa;
  padding: 20px;
`;

const Heading = styled.h1``;

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 30px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.toggle ? "#f70d1a" : "#39ff12")};
  color: #000;
  border: solid 2px ${(props) => (props.toggle ? "#f70d1a" : "#39ff12")};
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #fafafa;
  }
`;

const ChartFlexDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const ChartContainer = styled.div`
  margin: 20px auto;
  width: 45%;
  max-width: 800px;
`;

const MainFLexDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 20px;
`;

const CardMainDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-direction: column;
  gap: 25px;
`;

const CardDiv = styled.div`
  height: 160px;
  width: 450px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(30, 144, 255, 0.2),
    0 6px 20px 0 rgba(30, 144, 255, 0.2);
  padding: 10px;
`;

const CardSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
`;

const CardSubSection = styled.div`
  text-align: left;
  width: 45%;
  margin: 0;
`;

const CardLine = styled.div`
  border-left: 2px solid #1e90ff;
  height: 70px;
  margin: 0;
`;

const CardTitle = styled.p`
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 20px;
`;

const CardAttr = styled.p`
  margin: 10px 0;
  font-weight: 500;
  font-size: 18px;
`;

const CardInfo = styled.p`
  margin: 10px 0;
  font-size: 17px;
`;

const TableContainer = styled.div`
  /* margin: 20px auto; */
  width: 90%;
  max-width: 800px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(30, 144, 255, 0.2),
    0 6px 20px 0 rgba(30, 144, 255, 0.2);
  padding: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  background-color: #1e90ff;
  color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const ProgressDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProgressBarContainer = styled.div`
  width: 200px;
  background-color: #f1f1f1;
  border-radius: 8px;
  overflow: hidden;
  height: 10px;
  margin-right: 15px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #1e90ff;
  transition: width 0.3s ease;
  width: ${(props) => props.width || 0}%;
`;

const Progress = styled.p`
  color: #808080;
  margin: 0 25px 0 7.5px;
`;

const App = () => {
  const [metrics, setMetrics] = useState([]);
  const [topProcesses, setTopProcesses] = useState([]);
  const [systemInfo, setSystemInfo] = useState({});
  const [networkData, setNetworkData] = useState({ sent: 0, received: 0 });
  const [diskUsage, setDiskUsage] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
  const [networkSpeeds, setNetworkSpeeds] = useState([]);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/metrics");
      const data = response.data;

      if (data.message !== "Monitoring is stopped") {
        setMetrics((prevMetrics) => [
          ...prevMetrics.slice(-20),
          {
            time: new Date().toLocaleTimeString(),
            cpuUsage: data.cpu_percent,
            memoryUsage: data.memory_percent,
          },
        ]);
        setSystemInfo({
          bootTime: data.boot_time,
          uptime: data.uptime,
        });
        setNetworkData({
          sent: (data.bytes_sent / 1e6).toFixed(2),
          received: (data.bytes_recv / 1e6).toFixed(2),
        });
        setDiskUsage(data.disk_usage_percent);
        setTopProcesses(data.top_processes);
        setNetworkSpeeds((prevSpeeds) => [
          ...prevSpeeds.slice(-20),
          {
            time: new Date().toLocaleTimeString(),
            upload: (data.upload_speed / 1e6).toFixed(2),
            download: (data.download_speed / 1e6).toFixed(2),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const toggleMonitoring = async () => {
    if (isRunning) {
      await axios.post("http://127.0.0.1:5000/api/stop");
      setIsRunning(false);
    } else {
      await axios.post("http://127.0.0.1:5000/api/start");
      setIsRunning(true);
    }
  };

  const formatBootTime = (uptime) => {
    if (!uptime) return "N/A";

    const [hours, minutes, seconds] = uptime.split(":");

    const totalSeconds = Math.floor(parseFloat(seconds));
    const totalMinutes = parseInt(minutes, 10);
    const totalHours = parseInt(hours, 10);

    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    const parts = [];
    if (days > 0) parts.push(`${days} days`);
    if (remainingHours > 0) parts.push(`${remainingHours} hours`);
    if (totalMinutes > 0) parts.push(`${totalMinutes} mins`);
    if (totalSeconds > 0) parts.push(`${totalSeconds} secs`);

    return parts.join(", ");
  };

  useEffect(() => {
    if (isRunning) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const createChartData = (label, dataKey) => ({
    labels: metrics.map((m) => m.time),
    datasets: [
      {
        label: label,
        data: metrics.map((m) => m[dataKey]),
        borderColor: "#1e90ff",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
    animation: {
      duration: 300,
      easing: "linear",
    },
  });

  const createNetworkChartData = (label, key) => ({
    labels: networkSpeeds.map((s) => s.time),
    datasets: [
      {
        label: label,
        data: networkSpeeds.map((s) => s[key]),
        borderColor: "#1e90ff",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
    animation: {
      duration: 300,
      easing: "linear",
    },
  });

  return (
    <Container>
      <FlexDiv>
        <Heading>Dynamic Resource Monitor</Heading>
        <FlexDiv>
          <ProgressDiv>
            <ProgressBarContainer>
              <ProgressBar width={diskUsage} />
            </ProgressBarContainer>
            <FontAwesomeIcon icon="fa-solid fa-server" color="#808080" />
            <Progress>{diskUsage}%</Progress>
          </ProgressDiv>
          <Button onClick={toggleMonitoring} toggle={isRunning}>
            {isRunning ? "Stop" : "Start"}
          </Button>
        </FlexDiv>
      </FlexDiv>

      <MainFLexDiv>
        <CardMainDiv>
          <CardDiv>
            <CardTitle>System Information</CardTitle>
            <CardSection>
              <CardSubSection>
                <CardAttr>Boot Time</CardAttr>
                <CardInfo>{systemInfo.bootTime || "N/A"}</CardInfo>
              </CardSubSection>
              <CardLine />
              <CardSubSection>
                <CardAttr>Uptime</CardAttr>
                <CardInfo>
                  {formatBootTime(systemInfo.uptime) || "N/A"}
                </CardInfo>
              </CardSubSection>
            </CardSection>
          </CardDiv>
          <CardDiv>
            <CardTitle>Network Data</CardTitle>
            <CardSection>
              <CardSubSection>
                <CardAttr>Data Sent</CardAttr>
                <CardInfo>{networkData.sent} MB</CardInfo>
              </CardSubSection>
              <CardLine />
              <CardSubSection>
                <CardAttr>Data Received</CardAttr>
                <CardInfo>{networkData.received} MB</CardInfo>
              </CardSubSection>
            </CardSection>
          </CardDiv>
        </CardMainDiv>
        <TableContainer>
          <h2>Top Processes</h2>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader>Process Name</TableHeader>
                <TableHeader>PID</TableHeader>
                <TableHeader>CPU Usage (%)</TableHeader>
                <TableHeader>Memory Usage (%)</TableHeader>
              </tr>
            </thead>
            <tbody>
              {topProcesses.map((proc) => (
                <TableRow key={proc.pid}>
                  <TableData>{proc.name}</TableData>
                  <TableData>{proc.pid}</TableData>
                  <TableData>{proc.cpu_percent}</TableData>
                  <TableData>{proc.memory_percent}</TableData>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </MainFLexDiv>

      <ChartFlexDiv>
        <ChartContainer>
          <h2>CPU Usage</h2>
          <Line data={createChartData("CPU Usage (%)", "cpuUsage")} />
        </ChartContainer>

        <ChartContainer>
          <h2>Memory Usage</h2>
          <Line data={createChartData("Memory Usage (%)", "memoryUsage")} />
        </ChartContainer>

        <ChartContainer>
          <h2>Upload Speed</h2>
          <Line
            data={createNetworkChartData("Upload Speed (MBps)", "upload")}
          />
        </ChartContainer>

        <ChartContainer>
          <h2>Download Speed</h2>
          <Line
            data={createNetworkChartData("Download Speed (MBps)", "download")}
          />
        </ChartContainer>
      </ChartFlexDiv>
    </Container>
  );
};

export default App;
