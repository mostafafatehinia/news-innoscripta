"use client";
import { ChangeEvent, useEffect, useState } from "react";

import { AudioOutlined, LinkOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Pagination,
  Spin,
  Statistic,
  Tag,
  Select,
  Checkbox,
  type MenuProps,
  type CheckboxProps,
} from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
  CATEGORY_OPTIONS,
  DEFAULT_KEYS,
  MENU_ITEMS,
} from "@/constants/globals";
import { useDebounce, useGetNews } from "@/hooks";
import { renderTag, whichNewsIcon } from "@/utils";

const { RangePicker } = DatePicker;
const { Meta } = Card;
const Modal = dynamic(() => import("antd/lib/modal/Modal"), { ssr: false });
export default function Home() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string | undefined>();
  const [dates, setDates] = useState<[string, string] | undefined>();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(DEFAULT_KEYS);
  const [open, setOpen] = useState(true);
  const [skip, setSkip] = useState<string[]>(open ? DEFAULT_KEYS : []);

  const debouncedQuery = useDebounce(query, 500);

  const { news, loading } = useGetNews({
    query: debouncedQuery,
    skip,
    page: page,
    pageSize: skip.length ? skip.length * 4 : 3,
    from: dates?.[0],
    to: dates?.[1],
  });
  const { news: allNews } = useGetNews({
    from: dates?.[0],
    to: dates?.[1],
    skip,
  });

  useEffect(() => {
    if (!open) {
      setSkip([]);
    }
  }, [open]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onChange = (_: unknown, dateString: [string, string]) => {
    setDates(dateString);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "news") {
      return;
    } else if (selectedKeys.includes(e.key)) {
      setSelectedKeys(selectedKeys.filter((key) => key !== e.key));
      setSkip([...skip, e.key]);
    } else {
      setSelectedKeys([...selectedKeys, e.key]);
      setSkip(skip.filter((key) => key !== e.key));
    }
  };

  const handleSourcesChange: CheckboxProps["onChange"] = ({ target }) => {
    if (target.value === "news") {
      return;
    } else if (selectedKeys.includes(target.value)) {
      setSelectedKeys(selectedKeys.filter((key) => key !== target.value));
      setSkip([...skip, target.value]);
    } else {
      setSelectedKeys([...selectedKeys, target.value]);
      setSkip(skip.filter((key) => key !== target.value));
    }
  };

  const handleToggleModal = () => setOpen(!open);

  return (
    <>
      {!open ? (
        <div className="p-8 lg:p-20 space-y-4 lg:space-y-12">
          <div className="bg-[url('/images/newspaper-background.jpg')] h-full blur-lg bg-cover bg-center fixed inset-0 -z-10" />
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <Input
              placeholder="Search news"
              className="text-gray-800 placeholder:text-gray-400 shadow-2xl border border-gray-500"
              size="large"
              value={query}
              onChange={handleSearchChange}
            />
            <RangePicker
              className="text-gray-800 shadow-2xl border-gray-500 w-full lg:w-fit"
              size="large"
              onChange={onChange}
            />
            <Dropdown
              menu={{
                items: MENU_ITEMS,
                selectable: true,
                defaultSelectedKeys: DEFAULT_KEYS,
                selectedKeys,
                onClick: handleMenuClick,
              }}
            >
              <Button size="large">Source</Button>
            </Dropdown>
            <Select
              placeholder="Select a Category"
              size="large"
              style={{ width: 200 }}
              onChange={setQuery}
              options={CATEGORY_OPTIONS}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {news.map(({ id, title, url, source }) => (
              <Spin key={id} spinning={loading}>
                <Card
                  className="w-full h-fit"
                  actions={[
                    <Link key={"link"} href={url} target="_blank">
                      <LinkOutlined />
                    </Link>,
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={whichNewsIcon(source)} />}
                    title={title}
                    description={
                      <div className="flex justify-end">
                        <Tag
                          icon={<AudioOutlined />}
                          className="capitalize"
                          color="#3b5999"
                        >
                          {renderTag(source)}
                        </Tag>
                      </div>
                    }
                  />
                </Card>
              </Spin>
            ))}
          </div>
          {!news.length && (
            <div className="p-24 bg-white rounded-md">
              <Empty description="No news found" />
            </div>
          )}
          <div className="flex justify-between items-center bg-white p-4 rounded-md">
            <Pagination
              current={page}
              onChange={setPage}
              total={allNews.length}
              showSizeChanger={false}
            />
            <Statistic title="Total news" value={allNews.length} />
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen bg-gray-300 blur-md" />
      )}
      <Modal
        title="Customize your search"
        centered
        open={open}
        onOk={handleToggleModal}
        onCancel={handleToggleModal}
      >
        <div className="space-y-4">
          <div className="text-sm font-bold">Sources</div>
          {MENU_ITEMS.map((item) => (
            <Checkbox
              key={item.key}
              checked={selectedKeys.includes(item.key)}
              value={item.key}
              onChange={handleSourcesChange}
            >
              {item.label}
            </Checkbox>
          ))}
        </div>
      </Modal>
    </>
  );
}
