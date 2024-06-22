import { useEffect } from "react";
import useSWR, { preload } from "swr";
import * as API from "@/constants/api";
import Breadcrumb from "@/components/Breadcrumb";
import BannerInfo from "@/components/BannerInfo";
import Chart from "@/components/Chart";
import TableHistory from "@/components/TableHistory";
import SwitchControl from "@/components/SwitchControl";
import SwitchMode from "@/components/SwitchMode";
import SwitchSchedule from "@/components/SwitchSchedule";
import IndicatorStatus from "@/components/IndicatorStatus";

const fetcher = (url) => fetch(url).then((res) => res.json());

preload(API.urlBannerInfo, fetcher);

export default function Dashboard() {
  const breadcrumbs = [{ name: "Home" }, { name: "Dashboard", active: true }];

  const { data: bannerInfo } = useSWR(API.urlBannerInfo, fetcher, {
    refreshInterval: 10000,
  });

  const { data: graphSuhu } = useSWR(API.urlGraphSuhu, fetcher, {
    refreshInterval: 5000,
  });

  const { data: graphKelembaban } = useSWR(API.urlGraphKelembaban, fetcher, {
    refreshInterval: 5000,
  });

  const { data: history } = useSWR(API.urlHistory, fetcher, {
    refreshInterval: 10000,
  });

  const { data: switchControlFan, mutate: mutateSwitchControlFan } = useSWR(
    API.urlSwitchControlFan,
    fetcher,
    { refreshInterval: 2500 }
  );

  const { data: switchControlPump, mutate: mutateSwitchControlPump } = useSWR(
    API.urlSwitchControlPump,
    fetcher,
    { refreshInterval: 2500 }
  );

  const { data: indicatorStatus } = useSWR(API.urlIndicatorStatus, fetcher, {
    refreshInterval: 10000,
  });

  const { data: switchMode, mutate: setSwitchMode } = useSWR(
    API.urlSwitchMode,
    fetcher,
    { refreshInterval: 2500 }
  );

  const { data: switchSchedule, mutate: setSwitchSchedule } = useSWR(
    API.urlSwitchSchedule,
    fetcher,
    { refreshInterval: 2500 }
  );

  const { data: switchScheduleMode, mutate: setSwitchScheduleMode } = useSWR(
    API.urlSwitchScheduleMode,
    fetcher,
    { refreshInterval: 2500 }
  );

  const handleSwitchControlFan = async () => {
    const payload = {
      id: switchControlFan?.data.id,
      fan: Number(!switchControlFan?.data.fan),
    };

    const response = await fetch(`${API.urlSwitchControlFan}/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const newData = await response.json();

    mutateSwitchControlFan({
      ...switchControlFan,
      data: newData,
    });
  };

  const handleSwitchControlPump = async () => {
    const payload = {
      id: switchControlPump?.data.id,
      pump: Number(!switchControlPump?.data.pump),
    };

    const response = await fetch(`${API.urlSwitchControlPump}/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const newData = await response.json();

    mutateSwitchControlPump({
      ...switchControlPump,
      data: newData,
    });
  };

  const handleSwitchMode = async (val) => {
    console.log(val);
    const payload = { mode: val };

    const response = await fetch(`${API.urlSwitchMode}/1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const newData = await response.json();

    setSwitchMode({
      data: {
        id: newData.id,
        mode: newData.value,
      },
    });
  };

  const handleSwitchSchedule = async (event) => {
    const payload = { sMode: event.target.value };
    console.log(event, payload);

    const response = await fetch(`${API.urlSwitchSchedule}/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const newData = await response.json();

    setSwitchSchedule({
      data: {
        id: newData.id,
        schedule: newData.value,
      },
    });
  };

  const handleSwitchScheduleMode = async () => {
    const payload = { status: Boolean(!switchScheduleMode?.data.status) };

    const response = await fetch(`${API.urlSwitchScheduleMode}/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const newData = await response.json();

    setSwitchScheduleMode({
      data: {
        id: newData.id,
        status: newData.value,
      },
    });
  };

  useEffect(() => {}, [
    bannerInfo,
    graphSuhu,
    graphKelembaban,
    history,
    switchControlFan,
    switchControlPump,
    indicatorStatus,
    switchMode,
    switchSchedule,
    switchScheduleMode,
  ]);

  return (
    <div className="p-3">
      <Breadcrumb items={breadcrumbs} />

      <div className="row row-gap-3 my-4">
        <div id="banner-suhu" className="col-12 col-md-6 px-3">
          <BannerInfo
            title={"Suhu"}
            background={"warning"}
            value={bannerInfo?.data.suhu ?? 0}
            unit={"°C"}
            icon={"bi-thermometer"}
          />
        </div>

        <div id="banner-kelembaban" className="col-12 col-md-6 px-3">
          <BannerInfo
            title={"Kelembaban"}
            background={"info"}
            value={bannerInfo?.data.kelembaban ?? 0}
            unit={"%"}
            icon={"bi-snow"}
          />
        </div>
      </div>

      <div className="row row-gap-3 my-4">
        <div id="chart-suhu" className="col-12 col-lg-6 px-3">
          <Chart
            title={"Grafik Suhu"}
            items={graphSuhu?.data ?? []}
            color={"warning"}
          />
        </div>

        <div id="chart-kelembaban" className="col-12 col-lg-6 px-3">
          <Chart
            title={"Grafik Kelembaban"}
            items={graphKelembaban?.data ?? []}
            color={"info"}
          />
        </div>
      </div>

      <div className="row my-4">
        <div id="tabel-history" className="col-12 px-3">
          <TableHistory title={"History"} data={history?.data ?? []} />
        </div>
      </div>

      <div className="row row-gap-3 my-4">
        <div id="switch-control" className="col-12 col-lg-6 px-3">
          <div className="row mb-3">
            <div className="col-6">
              <IndicatorStatus
                title={"Indicator Fan"}
                value={indicatorStatus?.data.fan ?? 0}
              />
            </div>
            <div className="col-6">
              <IndicatorStatus
                title={"Indicator Pump"}
                value={indicatorStatus?.data.pump ?? 0}
              />
            </div>
          </div>

          <div className="row row-gap-3">
            <div className="col-12 col-sm-6">
              <SwitchControl
                title="Switch Fan"
                status={switchControlFan?.data.fan ?? 0}
                setStatus={handleSwitchControlFan}
              />
            </div>
            <div className="col-12 col-sm-6">
              <SwitchControl
                title="Switch Pump"
                status={switchControlPump?.data.pump ?? 0}
                setStatus={handleSwitchControlPump}
              />
            </div>
          </div>
        </div>

        <div id="switch-mode" className="col-12 col-lg-6 px-3">
          <div className="row row-gap-3">
            <div className="col-12 col-sm-6 col-lg-12">
              <SwitchMode
                title="Control Mode"
                value={switchMode?.data.mode ?? "auto"}
                setValue={handleSwitchMode}
              />
            </div>

            <div className="col-12 col-sm-6 col-lg-12">
              <SwitchSchedule
                title="Schedule Mode"
                status={switchScheduleMode?.data.status ?? false}
                setStatus={handleSwitchScheduleMode}
                value={switchSchedule?.data.schedule ?? "modeSchedule1"}
                setValue={handleSwitchSchedule}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
