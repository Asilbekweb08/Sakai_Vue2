export const NodeService = {
    getCargoTypeData() {
        return [
            { name: 'EUR-паллеты', code: '0' },
            { name: 'FIN-паллеты', code: '1' },
            { name: 'Особые паллеты', code: '2' },
            { name: 'Коробки', code: '3' },
            { name: 'Контейнер', code: '4' },
            { name: 'Сборный и разный груз', code: '5' },
            { name: 'Негабаритный', code: '6' },
            { name: 'Насыпной', code: '7' },
            { name: 'Навалочный', code: '8' },
            { name: 'Наливной', code: '9' },
            { name: 'Мешки', code: '10' },
            { name: 'Биг-бэги', code: '11' },
            { name: 'Еврокубы', code: '12' },
            { name: 'Бочки', code: '13' },
            { name: 'Рулоны', code: '14' },
            { name: 'Барабаны', code: '15' },
            { name: 'Бухта / Бунт', code: '16' },
            { name: 'Ящики', code: '17' }
        ];
    },
    getADRNodesData() {
        return [
            { name: 'Не опасный', code: '0' },
            { name: 'Опасный (не знаю ADR класс)', code: '1' },
            { name: '1: Взрывчатые материалы', code: '2' },
            { name: '2.1: Легковоспламеняющиеся газы', code: '3' },
            { name: '2.2: Не воспламеняющиеся не ядовитые газы', code: '4' },
            { name: '2.3: Ядовитые газы', code: '5' },
            { name: '3: Легковоспламеняющиеся жидкости', code: '6' },
            { name: '4.1: Легковоспламеняющиеся твердые вещества', code: '7' },
            { name: '4.2: Самовозгорающиеся вещества', code: '8' },
            { name: '4.3: Воспламеняющиеся газы при взаимодействии с водой', code: '9' },
            { name: '5.1: Окисляющие вещества', code: '10' },
            { name: '5.2: Органические пероксиды', code: '11' },
            { name: '6.1: Ядовитые вещества', code: '12' },
            { name: '6.2: Инфекционные вещества', code: '13' },
            { name: '7: Радиоактивные материалы', code: '14' },
            { name: '8: Едкие и коррозионные вещества', code: '15' },
            { name: '9: Прочие опасные грузы', code: '16' }
        ];
    },
    getCarSategoryData() {
        return [
            { name: 'Фургон легкий (LCV)', code: '0' },
            { name: 'Грузовик 3.5т - 12т', code: '1' },
            { name: 'Фура', code: '2' },
            { name: 'Спецтехника', code: '3' },
            { name: 'Автопоезд', code: '4' }
        ];
    },

    getTypeTransportationData() {
        return [
            { name: 'Любой: FTL или LTL', code: '0' },
            { name: 'FTL (выделенный транспорт)', code: '1' },
            { name: 'LTL (догруз)', code: '2' },
            { name: 'Проект, негабарит', code: '3' }
        ];
    },

    getTypeBodyNodesData() {
        return [
            {
                key: '0',
                label: 'Закрытые',
                data: 'Закрытые',

                children: [
                    { key: '0-0', label: 'Тент', data: 'Тент' },
                    { key: '0-1', label: 'Цельномет.', data: 'Цельномет.' },
                    { key: '0-2', label: 'Изотерм.', data: 'Изотерм.' },
                    { key: '0-3', label: 'Рефрижератор', data: 'Рефрижератор' }
                ]
            },
            {
                key: '1',
                label: 'Открытые',
                data: 'Открытые',

                children: [
                    { key: '1-0', label: 'Бортовой', data: 'Бортовой' },
                    { key: '1-1', label: 'Площадка', data: 'Площадка' },
                    { key: '1-2', label: 'Трал', data: 'Трал' },
                    { key: '1-3', label: 'Самосвал', data: 'Самосвал' }
                ]
            },
            {
                key: '2',
                label: 'Контейнерные',
                data: 'Контейнерные',

                children: [
                    { key: '2-0', label: 'Контейнеровоз', data: 'Контейнеровоз' },
                    { key: '2-1', label: 'Открытый контейнер (OTC)', data: 'Открытый контейнер (OTC)' },
                    { key: '2-2', label: 'Закрытый контейнер', data: 'Закрытый контейнер' },
                    { key: '2-3', label: 'Танк-контейнер', data: 'Танк-контейнер' }
                ]
            },
            {
                key: '3',
                label: 'Цистерны',
                data: 'Цистерны',

                children: [
                    { key: '3-0', label: 'Бензовоз', data: 'Бензовоз' },
                    { key: '3-1', label: 'Битумовоз', data: 'Битумовоз' },
                    { key: '3-2', label: 'Газовоз', data: 'Газовоз' },
                    { key: '3-3', label: 'Химическая', data: 'Химическая' },
                    { key: '3-4', label: 'Пищевая-наливная', data: 'Пищевая-наливная' },
                    { key: '3-5', label: 'Пищевая-сыпучая', data: 'Пищевая-сыпучая' },
                    { key: '3-6', label: 'Непищевая-сыпучая', data: 'Непищевая-сыпучая' },
                    { key: '3-7', label: 'Иной вид цистерны', data: 'Иной вид цистерны' }
                ]
            },
            {
                key: '4',
                label: 'Особые',
                data: 'Особые',

                children: [
                    { key: '4-0', label: 'Автовоз', data: 'Автовоз' },
                    { key: '4-1', label: 'Лесовоз', data: 'Лесовоз' },
                    { key: '4-2', label: 'Скотовоз', data: 'Скотовоз' },
                    { key: '4-3', label: 'Зерновоз', data: 'Зерновоз' },
                    { key: '4-4', label: 'Тушевоз', data: 'Тушевоз' },
                    { key: '4-5', label: 'Тягач с водителем', data: 'Тягач с водителем' },
                    { key: '4-6', label: 'Иной кузов', data: 'Иной кузов' }
                ]
            },
            {
                key: '5',
                label: 'Спецтехника',
                data: 'Спецтехника',

                children: [
                    { key: '5-0', label: 'Автокран', data: 'Автокран' },
                    { key: '5-1', label: 'Автовышка', data: 'Автовышка' },
                    { key: '5-2', label: 'Эвакуатор', data: 'Эвакуатор' },
                    { key: '5-3', label: 'Трактор', data: 'Трактор' },
                    { key: '5-4', label: 'Бульдозер', data: 'Бульдозер' },
                    { key: '5-5', label: 'Погрузчик', data: 'Погрузчик' }
                ]
            }
        ];
    },

    getTreeTableNodesData() {
        return [
            {
                key: '0',
                data: {
                    name: 'Applications',
                    size: '100kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '0-0',
                        data: {
                            name: 'Vue',
                            size: '25kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '0-0-0',
                                data: {
                                    name: 'vue.app',
                                    size: '10kb',
                                    type: 'Application'
                                }
                            },
                            {
                                key: '0-0-1',
                                data: {
                                    name: 'native.app',
                                    size: '10kb',
                                    type: 'Application'
                                }
                            },
                            {
                                key: '0-0-2',
                                data: {
                                    name: 'mobile.app',
                                    size: '5kb',
                                    type: 'Application'
                                }
                            }
                        ]
                    },
                    {
                        key: '0-1',
                        data: {
                            name: 'editor.app',
                            size: '25kb',
                            type: 'Application'
                        }
                    },
                    {
                        key: '0-2',
                        data: {
                            name: 'settings.app',
                            size: '50kb',
                            type: 'Application'
                        }
                    }
                ]
            },
            {
                key: '1',
                data: {
                    name: 'Cloud',
                    size: '20kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '1-0',
                        data: {
                            name: 'backup-1.zip',
                            size: '10kb',
                            type: 'Zip'
                        }
                    },
                    {
                        key: '1-1',
                        data: {
                            name: 'backup-2.zip',
                            size: '10kb',
                            type: 'Zip'
                        }
                    }
                ]
            },
            {
                key: '2',
                data: {
                    name: 'Desktop',
                    size: '150kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '2-0',
                        data: {
                            name: 'note-meeting.txt',
                            size: '50kb',
                            type: 'Text'
                        }
                    },
                    {
                        key: '2-1',
                        data: {
                            name: 'note-todo.txt',
                            size: '100kb',
                            type: 'Text'
                        }
                    }
                ]
            },
            {
                key: '3',
                data: {
                    name: 'Documents',
                    size: '75kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '3-0',
                        data: {
                            name: 'Work',
                            size: '55kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '3-0-0',
                                data: {
                                    name: 'Expenses.doc',
                                    size: '30kb',
                                    type: 'Document'
                                }
                            },
                            {
                                key: '3-0-1',
                                data: {
                                    name: 'Resume.doc',
                                    size: '25kb',
                                    type: 'Resume'
                                }
                            }
                        ]
                    },
                    {
                        key: '3-1',
                        data: {
                            name: 'Home',
                            size: '20kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '3-1-0',
                                data: {
                                    name: 'Invoices',
                                    size: '20kb',
                                    type: 'Text'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                key: '4',
                data: {
                    name: 'Downloads',
                    size: '25kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '4-0',
                        data: {
                            name: 'Spanish',
                            size: '10kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '4-0-0',
                                data: {
                                    name: 'tutorial-a1.txt',
                                    size: '5kb',
                                    type: 'Text'
                                }
                            },
                            {
                                key: '4-0-1',
                                data: {
                                    name: 'tutorial-a2.txt',
                                    size: '5kb',
                                    type: 'Text'
                                }
                            }
                        ]
                    },
                    {
                        key: '4-1',
                        data: {
                            name: 'Travel',
                            size: '15kb',
                            type: 'Text'
                        },
                        children: [
                            {
                                key: '4-1-0',
                                data: {
                                    name: 'Hotel.pdf',
                                    size: '10kb',
                                    type: 'PDF'
                                }
                            },
                            {
                                key: '4-1-1',
                                data: {
                                    name: 'Flight.pdf',
                                    size: '5kb',
                                    type: 'PDF'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                key: '5',
                data: {
                    name: 'Main',
                    size: '50kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '5-0',
                        data: {
                            name: 'bin',
                            size: '50kb',
                            type: 'Link'
                        }
                    },
                    {
                        key: '5-1',
                        data: {
                            name: 'etc',
                            size: '100kb',
                            type: 'Link'
                        }
                    },
                    {
                        key: '5-2',
                        data: {
                            name: 'var',
                            size: '100kb',
                            type: 'Link'
                        }
                    }
                ]
            },
            {
                key: '6',
                data: {
                    name: 'Other',
                    size: '5kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '6-0',
                        data: {
                            name: 'todo.txt',
                            size: '3kb',
                            type: 'Text'
                        }
                    },
                    {
                        key: '6-1',
                        data: {
                            name: 'logo.png',
                            size: '2kb',
                            type: 'Picture'
                        }
                    }
                ]
            },
            {
                key: '7',
                data: {
                    name: 'Pictures',
                    size: '150kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '7-0',
                        data: {
                            name: 'barcelona.jpg',
                            size: '90kb',
                            type: 'Picture'
                        }
                    },
                    {
                        key: '7-1',
                        data: {
                            name: 'primevue.png',
                            size: '30kb',
                            type: 'Picture'
                        }
                    },
                    {
                        key: '7-2',
                        data: {
                            name: 'prime.jpg',
                            size: '30kb',
                            type: 'Picture'
                        }
                    }
                ]
            },
            {
                key: '8',
                data: {
                    name: 'Videos',
                    size: '1500kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '8-0',
                        data: {
                            name: 'primefaces.mkv',
                            size: '1000kb',
                            type: 'Video'
                        }
                    },
                    {
                        key: '8-1',
                        data: {
                            name: 'intro.avi',
                            size: '500kb',
                            type: 'Video'
                        }
                    }
                ]
            }
        ];
    },

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData());
    },

    getTypeBodyNodes() {
        return Promise.resolve(this.getTypeBodyNodesData());
    },

    getADRNodes() {
        return Promise.resolve(this.getADRNodesData());
    },
    getCarSategory() {
        return Promise.resolve(this.getCarSategoryData());
    },
    getCargoType() {
        return Promise.resolve(this.getCargoTypeData());
    },
    getTypeTransportation() {
        return Promise.resolve(this.getTypeTransportationData());
    }
};
