'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Users, Clock, Sliders } from 'lucide-react';

// ─── 兼容两种数据格式 ───

// 格式 A: scenario 格式（固定字段）
interface ScenarioFormat {
    title: string;
    description: string;
    defaults: {
        employees: number;
        monthlySalary: number;
        workHoursPerDay: number;
        aiCostPerMonth: number;
        aiEfficiencyMultiplier: number;
    };
}

// 格式 B: inputs 数组格式（动态字段）
interface InputItem {
    id: string;
    label: string;
    default: number;
    unit: string;
    min?: number;
    max?: number;
    step?: number;
}

interface ROICalculatorProps {
    title?: string;
    scenario?: ScenarioFormat;
    inputs?: InputItem[];
    formula?: string;
    resultLabel?: string;
    onComplete?: () => void;
    [key: string]: unknown;
}

export default function ROICalculator(props: ROICalculatorProps) {
    const { onComplete } = props;

    // 判断使用哪种格式
    const isScenarioFormat = !!props.scenario?.defaults?.employees;

    if (isScenarioFormat) {
        return <ScenarioROI scenario={props.scenario!} onComplete={onComplete} />;
    }

    return <DynamicROI {...props} onComplete={onComplete} />;
}

// ═══════════════════════════════════════════════
//  格式 A: 固定 scenario 模式
// ═══════════════════════════════════════════════

function ScenarioROI({ scenario, onComplete }: { scenario: ScenarioFormat; onComplete?: () => void }) {
    const [inputs, setInputs] = useState(scenario.defaults);
    const [calculated, setCalculated] = useState(false);

    const traditionalMonthlyCost = inputs.employees * inputs.monthlySalary;
    const aiReplacedEmployees = Math.floor(inputs.employees * (1 - 1 / inputs.aiEfficiencyMultiplier));
    const aiMonthlyCost = inputs.aiCostPerMonth + (inputs.employees - aiReplacedEmployees) * inputs.monthlySalary;
    const monthlySaving = traditionalMonthlyCost - aiMonthlyCost;
    const annualSaving = monthlySaving * 12;
    const roiPercentage = traditionalMonthlyCost > 0 ? Math.round((monthlySaving / traditionalMonthlyCost) * 100) : 0;
    const paybackDays = monthlySaving > 0 ? Math.ceil(inputs.aiCostPerMonth / (monthlySaving / 30)) : Infinity;

    const handleCalculate = useCallback(() => {
        setCalculated(true);
        if (onComplete) setTimeout(onComplete, 3000);
    }, [onComplete]);

    const updateInput = (key: keyof typeof inputs, value: number) => {
        setInputs(prev => ({ ...prev, [key]: value }));
        setCalculated(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Calculator size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {scenario.title}
                    </h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{scenario.description}</p>
            </div>

            <div className="glass rounded-xl p-5 space-y-5 mb-6">
                <SliderInput icon={<Users size={16} />} label="团队规模" value={inputs.employees}
                    min={1} max={50} step={1} suffix="人" onChange={v => updateInput('employees', v)} />
                <SliderInput icon={<DollarSign size={16} />} label="人均月薪" value={inputs.monthlySalary}
                    min={3000} max={50000} step={1000} suffix="元" onChange={v => updateInput('monthlySalary', v)} />
                <SliderInput icon={<Clock size={16} />} label="AI 月成本" value={inputs.aiCostPerMonth}
                    min={100} max={10000} step={100} suffix="元" onChange={v => updateInput('aiCostPerMonth', v)} />
                <SliderInput icon={<TrendingUp size={16} />} label="AI 效率倍数" value={inputs.aiEfficiencyMultiplier}
                    min={2} max={20} step={1} suffix="x" onChange={v => updateInput('aiEfficiencyMultiplier', v)} />
            </div>

            {!calculated && (
                <motion.button onClick={handleCalculate}
                    className="w-full py-3 rounded-xl bg-[var(--accent-gold)] text-black text-sm font-semibold cursor-pointer hover:brightness-110 transition-all"
                    whileTap={{ scale: 0.98 }}>
                    计算 ROI
                </motion.button>
            )}

            {calculated && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard label="月省" value={`¥${monthlySaving.toLocaleString()}`} accent="emerald" />
                        <MetricCard label="年省" value={`¥${annualSaving.toLocaleString()}`} accent="emerald" />
                        <MetricCard label="ROI" value={`${roiPercentage}%`} accent="gold" />
                        <MetricCard label="回本" value={paybackDays < 999 ? `${paybackDays}天` : '—'} accent="teal" />
                    </div>

                    <div className="glass rounded-xl p-4">
                        <div className="text-xs text-[var(--text-muted)] mb-2">对比分析</div>
                        <div className="space-y-2">
                            <BarComparison label="传统成本" value={traditionalMonthlyCost} max={traditionalMonthlyCost} color="rgb(239, 68, 68)" />
                            <BarComparison label="AI 成本" value={aiMonthlyCost} max={traditionalMonthlyCost} color="rgb(16, 185, 129)" />
                        </div>
                        <div className="mt-3 text-xs text-[var(--text-secondary)]">
                            AI 可替代 <span className="text-[var(--accent-gold)] font-semibold">{aiReplacedEmployees}</span> 名员工的工作量，
                            保留 <span className="font-semibold">{inputs.employees - aiReplacedEmployees}</span> 人做核心决策。
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════
//  格式 B: 动态 inputs 数组模式
// ═══════════════════════════════════════════════

function DynamicROI({ title, inputs: inputDefs = [], formula, resultLabel = '计算结果', onComplete }: ROICalculatorProps) {
    const [values, setValues] = useState<Record<string, number>>(() => {
        const init: Record<string, number> = {};
        (inputDefs as InputItem[]).forEach(inp => { init[inp.id] = inp.default ?? 0; });
        return init;
    });
    const [calculated, setCalculated] = useState(false);

    const updateValue = (id: string, v: number) => {
        setValues(prev => ({ ...prev, [id]: v }));
        setCalculated(false);
    };

    // 安全计算 formula
    const result = useMemo(() => {
        if (!formula) return 0;
        try {
            let expr = formula;
            Object.entries(values).forEach(([k, v]) => {
                expr = expr.replace(new RegExp(k, 'g'), String(v));
            });
            // eslint-disable-next-line no-eval
            return Math.round(eval(expr));
        } catch {
            return 0;
        }
    }, [formula, values]);

    const handleCalculate = useCallback(() => {
        setCalculated(true);
        if (onComplete) setTimeout(onComplete, 3000);
    }, [onComplete]);

    // 自动推断 slider 范围
    const getRange = (inp: InputItem) => {
        const d = inp.default;
        return {
            min: inp.min ?? 0,
            max: inp.max ?? (d >= 10000 ? d * 5 : d >= 100 ? d * 10 : d >= 10 ? d * 5 : 100),
            step: inp.step ?? (d >= 10000 ? 1000 : d >= 100 ? 50 : d >= 10 ? 1 : 0.5),
        };
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Calculator size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {title || '计算器'}
                    </h3>
                </div>
            </div>

            <div className="glass rounded-xl p-5 space-y-5 mb-6">
                {(inputDefs as InputItem[]).map(inp => {
                    const range = getRange(inp);
                    return (
                        <SliderInput
                            key={inp.id}
                            icon={<Sliders size={16} />}
                            label={inp.label}
                            value={values[inp.id] ?? inp.default}
                            min={range.min}
                            max={range.max}
                            step={range.step}
                            suffix={inp.unit}
                            onChange={v => updateValue(inp.id, v)}
                        />
                    );
                })}
            </div>

            {!calculated && (
                <motion.button onClick={handleCalculate}
                    className="w-full py-3 rounded-xl bg-[var(--accent-gold)] text-black text-sm font-semibold cursor-pointer hover:brightness-110 transition-all"
                    whileTap={{ scale: 0.98 }}>
                    开始计算
                </motion.button>
            )}

            {calculated && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="glass rounded-xl p-6 text-center">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">{resultLabel}</div>
                        <div className="text-3xl font-bold text-[var(--accent-gold)]" style={{ fontFamily: 'var(--font-heading)' }}>
                            ¥{result.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2">
                            调整上方滑块参数，重新点击计算可查看不同场景
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════
//  共享子组件
// ═══════════════════════════════════════════════

function SliderInput({ icon, label, value, min, max, step, suffix, onChange }: {
    icon: React.ReactNode; label: string; value: number;
    min: number; max: number; step: number; suffix: string;
    onChange: (v: number) => void;
}) {
    const displayValue = value != null ? value : 0;
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    {icon} {label}
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {displayValue.toLocaleString()} {suffix}
                </div>
            </div>
            <input
                type="range"
                min={min} max={max} step={step} value={displayValue}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-gold)]
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(202,138,4,0.3)]"
            />
        </div>
    );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
    const colors: Record<string, string> = {
        emerald: 'text-emerald-400',
        gold: 'text-[var(--accent-gold)]',
        teal: 'text-[var(--accent-teal)]',
    };
    return (
        <div className="glass rounded-xl p-3 text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</div>
            <div className={`text-xl font-bold ${colors[accent] || 'text-white'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                {value}
            </div>
        </div>
    );
}

function BarComparison({ label, value, max, color }: {
    label: string; value: number; max: number; color: string;
}) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <div className="w-16 text-xs text-[var(--text-muted)]">{label}</div>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            <div className="w-20 text-xs text-right text-[var(--text-secondary)]">
                ¥{value.toLocaleString()}
            </div>
        </div>
    );
}
