import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  // 原始数据
  const originalData = [
    { Index: 1, Area: "健康基础", Indicator: "均衡饮食", "Sub Indicator": "—", "Baseline Score": 5, Data: "早餐：燕麦奇亚籽蔓越莓麦片，煎蛋，火腿1/2片，牛奶250ml；加餐红莓；午餐校餐。晚餐：白米饭，排骨，三文鱼，牛仔骨，清炒生菜。", Score: 5, "Scoring details": "早餐+1, 午餐+1, 晚餐+1, 加餐+1, 控糖达标+1" },
    { Index: 2, Area: "健康基础", Indicator: "充足睡眠", "Sub Indicator": "—", "Baseline Score": 5, Data: "昨晚9：30睡，早上7：45醒，晚上10：50睡", Score: 5, "Scoring details": "符合目标作息时间+5分" },
    { Index: 3, Area: "健康基础", Indicator: "规律运动", "Sub Indicator": "—", "Baseline Score": 3, Data: "学校30min outdoor recess", Score: 3, "Scoring details": "运动30分钟+3分" },
    { Index: 4, Area: "健康基础", Indicator: "作息规律", "Sub Indicator": "—", "Baseline Score": 5, Data: "晚睡", Score: 4, "Scoring details": "晚睡扣1分" },
    { Index: 5, Area: "习惯养成", Indicator: "自我管理", "Sub Indicator": "生活自理", "Baseline Score": 4, Data: "早晚独立洗漱，记得夹发夹，自己到家后整理书包", Score: 3, "Scoring details": "早晚洗漱2分, 整理书包1分" },
    { Index: 6, Area: "习惯养成", Indicator: "自我管理", "Sub Indicator": "优先级管理", "Baseline Score": 1, Data: "提醒后先做作业", Score: 1, "Scoring details": "经提醒执行+1分" },
    { Index: 7, Area: "习惯养成", Indicator: "自我管理", "Sub Indicator": "时间管理", "Baseline Score": 5, Data: "规定时间内完成：早晨洗漱，早饭，晚饭，睡前洗漱", Score: 4, "Scoring details": "完成4项任务，每项1分" },
    { Index: 8, Area: "习惯养成", Indicator: "自我管理", "Sub Indicator": "任务分解", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 9, Area: "习惯养成", Indicator: "自我管理", "Sub Indicator": "自制力", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 10, Area: "习惯养成", Indicator: "自我管理", "Sub Indicator": "责任感", "Baseline Score": 3, Data: "拿碗筷1次，给弟弟念书1次", Score: 3, "Scoring details": "家务1次+1, 照顾他人1次+2" },
    { Index: 11, Area: "习惯养成", Indicator: "安全与健康", "Sub Indicator": "安全意识", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 12, Area: "习惯养成", Indicator: "安全与健康", "Sub Indicator": "卫生习惯", "Baseline Score": 1, Data: "晚饭前经提醒洗手", Score: 1, "Scoring details": "经提醒洗手+1分" },
    { Index: 13, Area: "习惯养成", Indicator: "安全与健康", "Sub Indicator": "健康习惯", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 14, Area: "习惯养成", Indicator: "资源管理", "Sub Indicator": "物品收纳", "Baseline Score": 2, Data: "", Score: 2, "Scoring details": "无数据，延用基准分" },
    { Index: 15, Area: "习惯养成", Indicator: "资源管理", "Sub Indicator": "节约资源", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 16, Area: "习惯养成", Indicator: "社交与礼仪", "Sub Indicator": "礼貌沟通", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 17, Area: "习惯养成", Indicator: "社交与礼仪", "Sub Indicator": "非语言礼仪", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 18, Area: "习惯养成", Indicator: "社交与礼仪", "Sub Indicator": "倾听技巧", "Baseline Score": 1, Data: "耐心回答我关于after school的问题", Score: 1, "Scoring details": "倾听不打断+1分" },
    { Index: 19, Area: "习惯养成", Indicator: "社交与礼仪", "Sub Indicator": "诚信守约", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 20, Area: "学习能力", Indicator: "学习规划", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 21, Area: "学习能力", Indicator: "自主学习", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 22, Area: "学习能力", Indicator: "专注力", "Sub Indicator": "—", "Baseline Score": 4, Data: "", Score: 4, "Scoring details": "无数据，延用基准分" },
    { Index: 23, Area: "学习能力", Indicator: "任务反思", "Sub Indicator": "—", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 24, Area: "学习能力", Indicator: "批判性思维", "Sub Indicator": "—", "Baseline Score": 0, Data: "吃了奇亚籽后提问奇亚籽从什么植物上来，", Score: 1, "Scoring details": "仅提问+1分" },
    { Index: 25, Area: "学习能力", Indicator: "知识整合", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 26, Area: "学习能力", Indicator: "模式识别能力", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 27, Area: "学习能力", Indicator: "实践与应用", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 28, Area: "心理调适", Indicator: "情绪调节", "Sub Indicator": "—", "Baseline Score": 2, Data: "复习数学时不专心，态度散漫，被批评后一直没有恢复情绪.", Score: 0, "Scoring details": "情绪调节不达标" },
    { Index: 29, Area: "心理调适", Indicator: "正向心态", "Sub Indicator": "—", "Baseline Score": 0, Data: "早晨提前下楼吃早饭自我肯定一次,", Score: 1, "Scoring details": "使用肯定语句+1分" },
    { Index: 30, Area: "心理调适", Indicator: "压力应对", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 31, Area: "心理调适", Indicator: "内驱力", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 32, Area: "心理调适", Indicator: "自我反思", "Sub Indicator": "—", "Baseline Score": 1, Data: "坚持完成日记，简单记录", Score: 1, "Scoring details": "简单记录+1分" },
    { Index: 33, Area: "心理调适", Indicator: "同理心培养", "Sub Indicator": "—", "Baseline Score": 0, Data: "", Score: 0, "Scoring details": "无数据，延用基准分" },
    { Index: 34, Area: "技术能力", Indicator: "语言", "Sub Indicator": "—", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 35, Area: "技术能力", Indicator: "数学", "Sub Indicator": "—", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 36, Area: "技术能力", Indicator: "艺术创造", "Sub Indicator": "—", "Baseline Score": 1, Data: "", Score: 1, "Scoring details": "无数据，延用基准分" },
    { Index: 37, Area: "技术能力", Indicator: "数字素养", "Sub Indicator": "—", "Baseline Score": 1, Data: "独立使用技术工具+1分/次", Score: 1, "Scoring details": "独立使用技术工具1次+1分" }
  ];

  // 使用 useMemo 进行数据清洗（例如修正数据中的小错误）
  const cleanedData = useMemo(() => {
    return originalData.map(item => {
      // 示例：如果需要修正某条数据，可在此处进行调整
      if (item.Index === 2 && item.Score !== 5) {
        return { ...item, Score: 5 };
      }
      return item;
    });
  }, [originalData]);

  // 按区域分组，并计算每个区域的基准分、当前得分等信息
  const areaData = useMemo(() => {
    const areaGroups = {};
    cleanedData.forEach(item => {
      if (!areaGroups[item.Area]) {
        areaGroups[item.Area] = { area: item.Area, baselineTotal: 0, scoreTotal: 0, count: 0 };
      }
      areaGroups[item.Area].baselineTotal += item["Baseline Score"];
      areaGroups[item.Area].scoreTotal += item.Score;
      areaGroups[item.Area].count += 1;
    });
    return Object.values(areaGroups).map(group => ({
      name: group.area,
      baseline: group.baselineTotal,
      score: group.scoreTotal,
      baselineAvg: (group.baselineTotal / group.count).toFixed(2),
      scoreAvg: (group.scoreTotal / group.count).toFixed(2),
      diff: group.scoreTotal - group.baselineTotal
    }));
  }, [cleanedData]);

  // 计算总体基准分与当前得分
  const overallBaseline = useMemo(() => {
    return cleanedData.reduce((sum, item) => sum + item["Baseline Score"], 0);
  }, [cleanedData]);
  const overallScore = useMemo(() => {
    return cleanedData.reduce((sum, item) => sum + item.Score, 0);
  }, [cleanedData]);

  // 计算变动明显的指标
  const changedIndicators = useMemo(() => {
    return cleanedData.filter(item => item.Score !== item["Baseline Score"])
      .map(item => ({
        name: item.Indicator + (item["Sub Indicator"] !== "—" ? ` (${item["Sub Indicator"]})` : ""),
        baseline: item["Baseline Score"],
        score: item.Score,
        diff: item.Score - item["Baseline Score"],
        area: item.Area
      }))
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }, [cleanedData]);

  // 渲染各部分组件
  const renderOverallSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">总基准分</h2>
        <p className="text-3xl font-bold">{overallBaseline}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">总得分</h2>
        <p className="text-3xl font-bold">{overallScore}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">增长</h2>
        <p className={`text-3xl font-bold ${overallScore > overallBaseline ? 'text-green-500' : overallScore < overallBaseline ? 'text-red-500' : 'text-gray-500'}`}>
          {overallScore - overallBaseline > 0 ? '+' : ''}{overallScore - overallBaseline}
        </p>
      </div>
    </div>
  );

  const renderAreaComparison = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">各区域得分对比</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={areaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="baseline" name="基准分" fill="#8884d8" />
          <Bar dataKey="score" name="当前分数" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderAreaDistribution = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">基准分分布</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={areaData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="baseline"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {areaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value} (${((value / overallBaseline) * 100).toFixed(1)}%)`, props.payload.name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">当前分数分布</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={areaData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="score"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {areaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value} (${((value / overallScore) * 100).toFixed(1)}%)`, props.payload.name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderChangedIndicators = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">显著变化的指标</h2>
      {changedIndicators.length > 0 ? (
        <ResponsiveContainer width="100%" height={Math.max(300, changedIndicators.length * 40)}>
          <BarChart data={changedIndicators} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" name="基准分" fill="#8884d8" />
            <Bar dataKey="score" name="当前分数" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">没有发现显著变化的指标</p>
      )}
    </div>
  );

  const renderAreaDetailsTable = () => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">区域详情</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">区域</th>
              <th className="py-2 px-4 border-b text-right">基准分</th>
              <th className="py-2 px-4 border-b text-right">当前分数</th>
              <th className="py-2 px-4 border-b text-right">变化</th>
              <th className="py-2 px-4 border-b text-right">基准平均分</th>
              <th className="py-2 px-4 border-b text-right">当前平均分</th>
            </tr>
          </thead>
          <tbody>
            {areaData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b text-right">{item.baseline}</td>
                <td className="py-2 px-4 border-b text-right">{item.score}</td>
                <td className={`py-2 px-4 border-b text-right ${item.diff > 0 ? 'text-green-500' : item.diff < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.diff > 0 ? '+' : ''}{item.diff}
                </td>
                <td className="py-2 px-4 border-b text-right">{item.baselineAvg}</td>
                <td className="py-2 px-4 border-b text-right">{item.scoreAvg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">成长评估仪表板</h1>
      {renderOverallSummary()}
      {renderAreaComparison()}
      {renderAreaDistribution()}
      {renderChangedIndicators()}
      {renderAreaDetailsTable()}
    </div>
  );
};

export default Dashboard;
